import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { summarizeContent } from "@/lib/ai/summarizer";
import { estimateReadTime } from "@/lib/utils";
import type { SummarizeRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SummarizeRequest = await request.json();
    const { material_id, content, source_type, title } = body;

    if (!material_id || !content) {
      return NextResponse.json(
        { error: "material_id and content are required" },
        { status: 400 }
      );
    }

    // Verify material belongs to user
    const { data: material, error: materialError } = await supabase
      .from("materials")
      .select("id")
      .eq("id", material_id)
      .eq("user_id", user.id)
      .single();

    if (materialError || !material) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    // Generate summary using AI
    const summaryOutput = await summarizeContent({
      content,
      sourceType: source_type,
      title,
    });

    // Update material title if AI generated a better one
    if (summaryOutput.title) {
      await supabase
        .from("materials")
        .update({ title: summaryOutput.title })
        .eq("id", material_id);
    }

    // Save summary to database
    const { data: summary, error: summaryError } = await supabase
      .from("summaries")
      .upsert(
        {
          material_id,
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
      )
      .select()
      .single();

    if (summaryError) {
      console.error("Summary save error:", summaryError);
      return NextResponse.json(
        { error: "Failed to save summary" },
        { status: 500 }
      );
    }

    // Create initial progress record
    await supabase
      .from("progress")
      .upsert(
        {
          user_id: user.id,
          material_id,
          status: "unread",
        },
        { onConflict: "user_id,material_id", ignoreDuplicates: true }
      );

    return NextResponse.json({
      success: true,
      summary_id: summary.id,
      material_id,
    });
  } catch (error) {
    console.error("Summarize handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
