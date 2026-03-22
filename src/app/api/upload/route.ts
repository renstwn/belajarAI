import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getFileTypeFromName, estimateReadTime } from "@/lib/utils";
import { extractTextFromDocument } from "@/lib/extract/document";
import { summarizeContent } from "@/lib/ai/summarizer";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = getFileTypeFromName(file.name);
    if (!fileType) {
      return NextResponse.json(
        { error: "Unsupported file type. Use PDF, DOCX, TXT, or MD." },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum 10MB." },
        { status: 400 }
      );
    }

    // Upload to Supabase Storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Create material record
    const { data: material, error: materialError } = await supabase
      .from("materials")
      .insert({
        user_id: user.id,
        title: file.name.replace(/\.[^/.]+$/, ""),
        source_type: "document",
        file_path: filePath,
        file_type: fileType,
        original_filename: file.name,
      })
      .select()
      .single();

    if (materialError) {
      console.error("Material creation error:", materialError);
      return NextResponse.json(
        { error: "Failed to create material record" },
        { status: 500 }
      );
    }

    // Extract text from file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extractedText = await extractTextFromDocument(buffer, fileType);

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from file" },
        { status: 422 }
      );
    }

    // Generate AI summary
    const summaryOutput = await summarizeContent({
      content: extractedText,
      sourceType: "document",
      title: file.name.replace(/\.[^/.]+$/, ""),
    });

    // Update material title if AI generated a better one
    if (summaryOutput.title) {
      await supabase
        .from("materials")
        .update({ title: summaryOutput.title })
        .eq("id", material.id);
    }

    // Save summary
    await supabase.from("summaries").upsert(
      {
        material_id: material.id,
        short_summary: summaryOutput.short_summary,
        one_minute_summary: summaryOutput.one_minute_summary,
        five_minute_summary: summaryOutput.five_minute_summary,
        full_summary: summaryOutput.full_summary,
        key_points: summaryOutput.key_points,
        important_terms: summaryOutput.important_terms,
        faq: summaryOutput.faq,
        conclusion: summaryOutput.conclusion,
        next_steps: summaryOutput.next_steps,
        estimated_read_time: estimateReadTime(
          summaryOutput.full_summary || summaryOutput.five_minute_summary || ""
        ),
      },
      { onConflict: "material_id" }
    );

    // Create initial progress record
    await supabase.from("progress").upsert(
      {
        user_id: user.id,
        material_id: material.id,
        status: "unread",
      },
      { onConflict: "user_id,material_id", ignoreDuplicates: true }
    );

    return NextResponse.json({
      success: true,
      material_id: material.id,
      message: "File uploaded and summarized successfully.",
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const isRateLimit = message.includes("rate limited") || message.includes("Rate limited") || message.includes("429");
    return NextResponse.json(
      { error: isRateLimit ? "AI sedang sibuk, tunggu 1 menit lalu coba lagi." : message },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
