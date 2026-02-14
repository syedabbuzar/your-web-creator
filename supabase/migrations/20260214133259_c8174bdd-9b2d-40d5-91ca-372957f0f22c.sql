
-- Create exam_resources table for downloadable resources
CREATE TABLE public.exam_resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  file_type text NOT NULL DEFAULT 'PDF',
  file_size text NOT NULL DEFAULT '',
  file_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exam_resources ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Exam resources publicly readable" ON public.exam_resources FOR SELECT USING (true);
CREATE POLICY "Exam resources publicly insertable" ON public.exam_resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Exam resources publicly updatable" ON public.exam_resources FOR UPDATE USING (true);
CREATE POLICY "Exam resources publicly deletable" ON public.exam_resources FOR DELETE USING (true);

-- Create storage bucket for exam resource files
INSERT INTO storage.buckets (id, name, public) VALUES ('exam-resources', 'exam-resources', true);

-- Storage policies
CREATE POLICY "Exam resource files publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'exam-resources');
CREATE POLICY "Exam resource files publicly insertable" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'exam-resources');
CREATE POLICY "Exam resource files publicly updatable" ON storage.objects FOR UPDATE USING (bucket_id = 'exam-resources');
CREATE POLICY "Exam resource files publicly deletable" ON storage.objects FOR DELETE USING (bucket_id = 'exam-resources');
