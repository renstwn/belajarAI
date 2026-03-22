-- ============================================
-- BelajarAI - Database Schema for Supabase
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE source_type AS ENUM ('document', 'youtube');
CREATE TYPE progress_status AS ENUM ('unread', 'in_progress', 'completed');
CREATE TYPE file_type AS ENUM ('pdf', 'docx', 'txt', 'md');

-- ============================================
-- USERS (extends Supabase auth.users)
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- TAGS
-- ============================================

CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- MATERIALS
-- ============================================

CREATE TABLE public.materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_type source_type NOT NULL,
  source_url TEXT,
  file_path TEXT,
  file_type file_type,
  original_filename TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_materials_user_id ON public.materials(user_id);
CREATE INDEX idx_materials_source_type ON public.materials(source_type);
CREATE INDEX idx_materials_created_at ON public.materials(created_at DESC);

-- ============================================
-- SUMMARIES
-- ============================================

CREATE TABLE public.summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL UNIQUE REFERENCES public.materials(id) ON DELETE CASCADE,
  short_summary TEXT,
  one_minute_summary TEXT,
  five_minute_summary TEXT,
  full_summary TEXT,
  key_points JSONB DEFAULT '[]'::jsonb,
  important_terms JSONB DEFAULT '[]'::jsonb,
  faq JSONB DEFAULT '[]'::jsonb,
  conclusion TEXT,
  next_steps JSONB DEFAULT '[]'::jsonb,
  estimated_read_time INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_summaries_material_id ON public.summaries(material_id);

-- ============================================
-- PROGRESS
-- ============================================

CREATE TABLE public.progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  status progress_status DEFAULT 'unread' NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, material_id)
);

CREATE INDEX idx_progress_user_id ON public.progress(user_id);
CREATE INDEX idx_progress_material_id ON public.progress(material_id);

-- ============================================
-- BOOKMARKS
-- ============================================

CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, material_id)
);

CREATE INDEX idx_bookmarks_user_id ON public.bookmarks(user_id);

-- ============================================
-- NOTES
-- ============================================

CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, material_id)
);

CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_material_id ON public.notes(material_id);

-- ============================================
-- MATERIAL TAGS (junction table)
-- ============================================

CREATE TABLE public.material_tags (
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (material_id, tag_id)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_tags ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/insert/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can create own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Materials: users can CRUD their own materials
CREATE POLICY "Users can view own materials" ON public.materials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create materials" ON public.materials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own materials" ON public.materials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own materials" ON public.materials FOR DELETE USING (auth.uid() = user_id);

-- Summaries: accessible if user owns the material
CREATE POLICY "Users can view summaries of own materials" ON public.summaries FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.materials WHERE materials.id = summaries.material_id AND materials.user_id = auth.uid()));
CREATE POLICY "Users can create summaries for own materials" ON public.summaries FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.materials WHERE materials.id = summaries.material_id AND materials.user_id = auth.uid()));
CREATE POLICY "Users can update summaries of own materials" ON public.summaries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.materials WHERE materials.id = summaries.material_id AND materials.user_id = auth.uid()));
CREATE POLICY "Users can delete summaries of own materials" ON public.summaries FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.materials WHERE materials.id = summaries.material_id AND materials.user_id = auth.uid()));

-- Progress: users manage their own progress
CREATE POLICY "Users can manage own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

-- Bookmarks: users manage their own bookmarks
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- Notes: users manage their own notes
CREATE POLICY "Users can manage own notes" ON public.notes FOR ALL USING (auth.uid() = user_id);

-- Tags: readable by all authenticated users
CREATE POLICY "Authenticated users can read tags" ON public.tags FOR SELECT TO authenticated USING (true);

-- Material tags: accessible if user owns the material
CREATE POLICY "Users can manage tags of own materials" ON public.material_tags FOR ALL
  USING (EXISTS (SELECT 1 FROM public.materials WHERE materials.id = material_tags.material_id AND materials.user_id = auth.uid()));

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

CREATE POLICY "Users can upload documents" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own documents" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================
-- SEED DATA: Tags
-- ============================================

INSERT INTO public.tags (name, color) VALUES
  ('Programming', '#6366f1'),
  ('Machine Learning', '#8b5cf6'),
  ('Web Development', '#3b82f6'),
  ('Data Science', '#06b6d4'),
  ('DevOps', '#10b981'),
  ('Database', '#f59e0b'),
  ('Mobile Dev', '#ef4444'),
  ('Cloud', '#ec4899'),
  ('Security', '#f97316'),
  ('UI/UX', '#14b8a6');
