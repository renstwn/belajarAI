import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getYouTubeMetadata, getYouTubeTranscript } from "@/lib/extract/youtube";
import { getYouTubeVideoId, estimateReadTime } from "@/lib/utils";
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

    const { url } = await request.json();

    if (!url || !getYouTubeVideoId(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    // Fetch metadata
    const metadata = await getYouTubeMetadata(url);
    if (!metadata) {
      return NextResponse.json(
        { error: "Could not fetch video metadata" },
        { status: 400 }
      );
    }

    // Fetch transcript (or fallback to description)
    const transcript = await getYouTubeTranscript(url);
    const contentForAI = transcript
      || metadata.description
      || null;

    if (!contentForAI) {
      return NextResponse.json(
        {
          error: "Tidak bisa mendapatkan konten dari video ini. Video tidak memiliki subtitle dan deskripsi.",
          code: "NO_CONTENT",
        },
        { status: 422 }
      );
    }

    const isFromTranscript = !!transcript;

    // Create material record
    const { data: material, error: materialError } = await supabase
      .from("materials")
      .insert({
        user_id: user.id,
        title: metadata.title,
        source_type: "youtube",
        source_url: url,
        thumbnail_url: metadata.thumbnail,
      })
      .select()
      .single();

    if (materialError) {
      console.error("Material creation error:", materialError);
      return NextResponse.json(
        { error: "Failed to create material" },
        { status: 500 }
      );
    }

    // Generate AI summary
    const summaryOutput = await summarizeContent({
      content: contentForAI,
      sourceType: "youtube",
      title: metadata.title,
      isMetadataOnly: !isFromTranscript,
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
      message: "Video processed and summarized successfully.",
    });
  } catch (error) {
    console.error("YouTube handler error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const isRateLimit = message.includes("rate limited") || message.includes("Rate limited") || message.includes("429");
    return NextResponse.json(
      { error: isRateLimit ? "AI sedang sibuk, tunggu 1 menit lalu coba lagi." : message },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
