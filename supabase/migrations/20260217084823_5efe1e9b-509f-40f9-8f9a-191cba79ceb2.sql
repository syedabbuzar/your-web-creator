
-- Create exam_result_attachments table
CREATE TABLE public.exam_result_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  result_id UUID REFERENCES public.exam_results(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.exam_result_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exam result attachments publicly readable" ON public.exam_result_attachments FOR SELECT USING (true);
CREATE POLICY "Exam result attachments publicly insertable" ON public.exam_result_attachments FOR INSERT WITH CHECK (true);
CREATE POLICY "Exam result attachments publicly updatable" ON public.exam_result_attachments FOR UPDATE USING (true);
CREATE POLICY "Exam result attachments publicly deletable" ON public.exam_result_attachments FOR DELETE USING (true);

-- Create site-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('site-images', 'site-images', true);

-- Storage policies for site-images bucket
CREATE POLICY "Site images publicly readable" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Site images publicly insertable" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-images');
CREATE POLICY "Site images publicly updatable" ON storage.objects FOR UPDATE USING (bucket_id = 'site-images');
CREATE POLICY "Site images publicly deletable" ON storage.objects FOR DELETE USING (bucket_id = 'site-images');
