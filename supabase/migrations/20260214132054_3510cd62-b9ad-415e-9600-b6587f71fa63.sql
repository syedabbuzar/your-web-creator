
-- Exam schedules table
CREATE TABLE public.exam_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam text NOT NULL,
  classes text NOT NULL,
  start_date text NOT NULL,
  end_date text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exam schedules publicly readable" ON public.exam_schedules FOR SELECT USING (true);
CREATE POLICY "Exam schedules publicly insertable" ON public.exam_schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Exam schedules publicly updatable" ON public.exam_schedules FOR UPDATE USING (true);
CREATE POLICY "Exam schedules publicly deletable" ON public.exam_schedules FOR DELETE USING (true);

-- Exam results table
CREATE TABLE public.exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'upcoming',
  result_date text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exam results publicly readable" ON public.exam_results FOR SELECT USING (true);
CREATE POLICY "Exam results publicly insertable" ON public.exam_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Exam results publicly updatable" ON public.exam_results FOR UPDATE USING (true);
CREATE POLICY "Exam results publicly deletable" ON public.exam_results FOR DELETE USING (true);

-- Seed exam schedules
INSERT INTO public.exam_schedules (exam, classes, start_date, end_date, sort_order) VALUES
('First Term Examination', 'I - XII', 'July 15, 2025', 'July 25, 2025', 1),
('Mid-Term Examination', 'I - XII', 'October 10, 2025', 'October 20, 2025', 2),
('Second Term Examination', 'I - XII', 'December 15, 2025', 'December 23, 2025', 3),
('Annual Examination', 'I - XII', 'March 1, 2026', 'March 15, 2026', 4);

-- Seed exam results
INSERT INTO public.exam_results (title, description, status, sort_order) VALUES
('Results Portal', 'Results will be published after the examination period. Check back for updates.', 'upcoming', 1);
