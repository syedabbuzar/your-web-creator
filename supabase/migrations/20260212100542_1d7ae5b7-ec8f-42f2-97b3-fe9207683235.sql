
-- Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  date TEXT NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Conference',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are publicly readable" ON public.events FOR SELECT USING (true);
CREATE POLICY "Events are publicly insertable" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Events are publicly updatable" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Events are publicly deletable" ON public.events FOR DELETE USING (true);

-- Facilities table
CREATE TABLE public.facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL DEFAULT 'Building',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Facilities are publicly readable" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Facilities are publicly insertable" ON public.facilities FOR INSERT WITH CHECK (true);
CREATE POLICY "Facilities are publicly updatable" ON public.facilities FOR UPDATE USING (true);
CREATE POLICY "Facilities are publicly deletable" ON public.facilities FOR DELETE USING (true);

-- Gallery table
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gallery is publicly readable" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Gallery is publicly insertable" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Gallery is publicly updatable" ON public.gallery FOR UPDATE USING (true);
CREATE POLICY "Gallery is publicly deletable" ON public.gallery FOR DELETE USING (true);

-- Leaders table
CREATE TABLE public.leaders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leaders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaders are publicly readable" ON public.leaders FOR SELECT USING (true);
CREATE POLICY "Leaders are publicly insertable" ON public.leaders FOR INSERT WITH CHECK (true);
CREATE POLICY "Leaders are publicly updatable" ON public.leaders FOR UPDATE USING (true);
CREATE POLICY "Leaders are publicly deletable" ON public.leaders FOR DELETE USING (true);

-- Seed default events
INSERT INTO public.events (title, description, full_description, date, image, category, sort_order) VALUES
('Educational Expo & Conference 2025', 'Join us for an exciting educational expo featuring innovative teaching methods, modern technologies, and interactive sessions with education experts from across the country.', 'Scholar Educational Campus proudly presents the Educational Expo & Conference 2025 — a landmark event bringing together educators, innovators, and thought leaders from across the nation.

This full-day conference will feature:

• **Keynote Speeches** by renowned education experts on modern pedagogy and future-ready learning
• **Interactive Workshops** on integrating technology in classrooms, including AI-powered learning tools
• **Exhibition Stalls** showcasing the latest educational technology, books, and resources
• **Panel Discussions** on the National Education Policy and its impact on school education
• **Student Demonstrations** of science projects, robotics, and innovation labs

The expo aims to bridge the gap between traditional teaching and modern educational methodologies. Parents, teachers, and students are all welcome to attend and explore new horizons in education.

Venue: Scholar Educational Campus, Main Auditorium
Time: 9:00 AM - 5:00 PM
Registration: Free for all attendees', 'March 15, 2025', '/Event2.jpg', 'Conference', 1),

('Glimpse of Urooj 2025', 'Annual cultural festival celebrating talent, creativity, and the spirit of our students. Music, dance, drama, and art exhibitions await!', 'Urooj 2025 is the flagship annual cultural festival of Scholar Educational Campus, a grand celebration of talent, creativity, and youthful energy!

This year''s edition promises to be bigger and better with:

• **Music & Dance Performances** — Solo and group performances across classical, folk, and contemporary genres
• **Drama & Theatre** — Students present original plays and skits on social themes
• **Art & Craft Exhibition** — Paintings, sculptures, and handmade crafts by budding artists
• **Literary Events** — Poetry recitation, elocution, debate, and essay writing competitions
• **Fashion Show** — Students showcase creative costumes themed around Indian culture
• **Food Festival** — Stalls run by students featuring cuisines from different states

Urooj is not just a festival, it''s a platform where every student gets a chance to shine. The event fosters teamwork, confidence, and cultural awareness among students.

Venue: Scholar Educational Campus, Open Ground & Auditorium
Time: 10:00 AM - 6:00 PM
Open for parents and guests', 'February 28, 2025', '/Event1.jpg', 'Cultural', 2),

('POCSO Act 2012 Awareness Workshop', 'Important awareness session about child protection laws and safety measures. A must-attend for parents, teachers, and students.', 'Scholar Educational Campus organized a crucial awareness workshop on the Protection of Children from Sexual Offences (POCSO) Act, 2012.

The workshop covered:

• **Understanding POCSO Act** — Detailed explanation of the act, its provisions, and legal framework
• **Recognizing Signs** — How parents and teachers can identify if a child is in distress
• **Reporting Mechanisms** — Step-by-step guide on how to report incidents and seek help
• **Preventive Measures** — Safety tips for children, parents, and educational institutions
• **Interactive Q&A Session** — Experts answered queries from parents and teachers
• **Resource Materials** — Handouts and helpline numbers distributed to all attendees

The session was conducted by legal experts and child psychologists, emphasizing that child safety is a collective responsibility. The workshop reinforced our commitment to creating a safe and nurturing environment for every child.

Venue: Scholar Educational Campus, Conference Hall
Time: 11:00 AM - 2:00 PM
Attended by: Parents, Teachers, and Senior Students', 'February 20, 2025', '/Event4.jpg', 'Workshop', 3),

('MESTA Award Ceremony', 'Celebrating excellence in education. Scholar Campus recognized at the prestigious MESTA awards ceremony.', 'Scholar Educational Campus was honored at the prestigious MESTA (Merit in Education, Science, Technology & Arts) Award Ceremony — a proud moment for our entire campus family!

Highlights of the ceremony:

• **Award Recognition** — Scholar Campus received the award for Excellence in Holistic Education
• **Chief Guest** — The ceremony was graced by eminent personalities from the education sector
• **Student Achievers** — Our top-performing students were felicitated for their outstanding academic achievements
• **Teacher Recognition** — Dedicated teachers were honored for their contribution to quality education
• **Campus Showcase** — A presentation highlighting our infrastructure, teaching methodology, and student achievements

This award recognizes our commitment to providing quality education that goes beyond textbooks. It validates our approach of nurturing not just academic excellence, but also character, creativity, and critical thinking.

We thank all parents, students, and staff for making this achievement possible. This award motivates us to continue striving for excellence in everything we do.

Venue: MESTA Convention Center
Date: March 5, 2025', 'March 5, 2025', '/Event3.jpg', 'Academic', 4);

-- Seed default facilities
INSERT INTO public.facilities (icon, title, description, sort_order) VALUES
('Book', 'Library', 'State-of-the-art library with over 50,000 books, digital resources, and quiet study areas.', 1),
('Beaker', 'Science Labs', 'Modern physics, chemistry, and biology laboratories equipped with latest equipment.', 2),
('Monitor', 'Computer Lab', 'Advanced computer facilities with high-speed internet and latest software.', 3),
('Dumbbell', 'Sports Complex', 'Indoor and outdoor sports facilities including basketball courts, swimming pool, and gymnasium.', 4),
('Music', 'Music Room', 'Fully equipped music room with various instruments for developing artistic talents.', 5),
('Trees', 'Green Campus', 'Eco-friendly campus with beautiful gardens, trees, and sustainable practices.', 6),
('Utensils', 'Cafeteria', 'Hygienic cafeteria serving nutritious meals prepared by professional chefs.', 7),
('Building', 'Smart Classrooms', 'Technology-enabled classrooms with projectors, smart boards, and AC facilities.', 8);

-- Seed default gallery
INSERT INTO public.gallery (src, alt, sort_order) VALUES
('https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop', 'Main Building', 1),
('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop', 'Classroom', 2),
('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop', 'Computer Lab', 3),
('https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop', 'Library', 4),
('https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop', 'Sports Ground', 5),
('https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', 'Campus View', 6);

-- Seed default leaders
INSERT INTO public.leaders (name, role, image, sort_order) VALUES
('Dr. Rajesh Kumar', 'Principal', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', 1),
('Mrs. Priya Sharma', 'Vice Principal', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop', 2),
('Mr. Amit Verma', 'Academic Director', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop', 3),
('Mrs. Sunita Patel', 'Administrative Head', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop', 4);
