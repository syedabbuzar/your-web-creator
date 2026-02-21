
-- Table for multiple images per event
CREATE TABLE public.event_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.event_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event images" ON public.event_images FOR SELECT USING (true);
CREATE POLICY "Anyone can insert event images" ON public.event_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update event images" ON public.event_images FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete event images" ON public.event_images FOR DELETE USING (true);
