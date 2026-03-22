// ============================================
// Database Types for BelajarAI
// ============================================

export type SourceType = "document" | "youtube";
export type ProgressStatus = "unread" | "in_progress" | "completed";
export type FileType = "pdf" | "docx" | "txt" | "md";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Material {
  id: string;
  user_id: string;
  title: string;
  source_type: SourceType;
  source_url: string | null;
  file_path: string | null;
  file_type: FileType | null;
  original_filename: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Summary {
  id: string;
  material_id: string;
  short_summary: string | null;
  one_minute_summary: string | null;
  five_minute_summary: string | null;
  full_summary: string | null;
  key_points: string[];
  important_terms: ImportantTerm[];
  faq: FAQ[];
  conclusion: string | null;
  next_steps: string[];
  estimated_read_time: number;
  created_at: string;
  updated_at: string;
}

export interface ImportantTerm {
  term: string;
  definition: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Progress {
  id: string;
  user_id: string;
  material_id: string;
  status: ProgressStatus;
  completed_at: string | null;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  material_id: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  material_id: string;
  content: string;
  updated_at: string;
  created_at: string;
}

export interface MaterialTag {
  material_id: string;
  tag_id: string;
}

// ============================================
// Extended types with relations
// ============================================

export interface MaterialWithDetails extends Material {
  summary: Summary | null;
  progress: Progress | null;
  bookmark: Bookmark | null;
  note: Note | null;
  tags: Tag[];
}

// ============================================
// AI Summarizer output type
// ============================================

export interface SummaryOutput {
  title: string;
  short_summary: string;
  one_minute_summary: string;
  five_minute_summary: string;
  full_summary: string;
  key_points: string[];
  important_terms: ImportantTerm[];
  faq: FAQ[];
  conclusion: string;
  next_steps: string[];
}

// ============================================
// API types
// ============================================

export interface UploadResponse {
  success: boolean;
  material_id?: string;
  error?: string;
}

export interface SummarizeRequest {
  material_id: string;
  content: string;
  source_type: SourceType;
  title?: string;
}

// ============================================
// Dashboard stats
// ============================================

export interface DashboardStats {
  totalMaterials: number;
  totalSummaries: number;
  completedMaterials: number;
  totalBookmarks: number;
  progressPercentage: number;
}
