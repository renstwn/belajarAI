"use server";

import { createClient } from "@/lib/supabase/server";
import type { MaterialWithDetails, DashboardStats, SourceType } from "@/types";

export async function getMaterials(filters?: {
  source_type?: SourceType;
  search?: string;
  bookmarked?: boolean;
}): Promise<MaterialWithDetails[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("materials")
    .select(
      `
      *,
      summary:summaries(*),
      progress:progress(*),
      bookmark:bookmarks(*),
      note:notes(*),
      tags:material_tags(tag:tags(*))
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (filters?.source_type) {
    query = query.eq("source_type", filters.source_type);
  }

  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching materials:", error);
    return [];
  }

  return (data || []).map((item) => ({
    ...item,
    summary: Array.isArray(item.summary) ? item.summary[0] || null : item.summary,
    progress: Array.isArray(item.progress) ? item.progress[0] || null : item.progress,
    bookmark: Array.isArray(item.bookmark) ? item.bookmark[0] || null : item.bookmark,
    note: Array.isArray(item.note) ? item.note[0] || null : item.note,
    tags: (item.tags || []).map((t: { tag: unknown }) => t.tag).filter(Boolean),
  }));
}

export async function getMaterialById(
  id: string
): Promise<MaterialWithDetails | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("materials")
    .select(
      `
      *,
      summary:summaries(*),
      progress:progress(*),
      bookmark:bookmarks(*),
      note:notes(*),
      tags:material_tags(tag:tags(*))
    `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    summary: Array.isArray(data.summary) ? data.summary[0] || null : data.summary,
    progress: Array.isArray(data.progress) ? data.progress[0] || null : data.progress,
    bookmark: Array.isArray(data.bookmark) ? data.bookmark[0] || null : data.bookmark,
    note: Array.isArray(data.note) ? data.note[0] || null : data.note,
    tags: (data.tags || []).map((t: { tag: unknown }) => t.tag).filter(Boolean),
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      totalMaterials: 0,
      totalSummaries: 0,
      completedMaterials: 0,
      totalBookmarks: 0,
      progressPercentage: 0,
    };
  }

  const [materials, summaries, completed, bookmarks] = await Promise.all([
    supabase
      .from("materials")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("summaries")
      .select("id", { count: "exact", head: true })
      .in(
        "material_id",
        (
          await supabase
            .from("materials")
            .select("id")
            .eq("user_id", user.id)
        ).data?.map((m) => m.id) || []
      ),
    supabase
      .from("progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "completed"),
    supabase
      .from("bookmarks")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const totalMaterials = materials.count || 0;
  const completedCount = completed.count || 0;

  return {
    totalMaterials,
    totalSummaries: summaries.count || 0,
    completedMaterials: completedCount,
    totalBookmarks: bookmarks.count || 0,
    progressPercentage:
      totalMaterials > 0
        ? Math.round((completedCount / totalMaterials) * 100)
        : 0,
  };
}

export async function toggleBookmark(materialId: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("material_id", materialId)
    .single();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id);
    return false;
  } else {
    await supabase
      .from("bookmarks")
      .insert({ user_id: user.id, material_id: materialId });
    return true;
  }
}

export async function updateProgress(
  materialId: string,
  status: "unread" | "in_progress" | "completed"
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("progress").upsert(
    {
      user_id: user.id,
      material_id: materialId,
      status,
      completed_at: status === "completed" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,material_id" }
  );
}

export async function saveNote(
  materialId: string,
  content: string
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("notes").upsert(
    {
      user_id: user.id,
      material_id: materialId,
      content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,material_id" }
  );
}
