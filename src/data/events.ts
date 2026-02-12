import event1Img from "@/assets/Event1.jpg";
import event2Img from "@/assets/Event2.jpg";
import event3Img from "@/assets/Event3.jpg";
import event4Img from "@/assets/Event4.jpg";

export interface EventItem {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  date: string;
  image: string;
  category: string;
}

export const defaultEvents: EventItem[] = [
  {
    id: "1",
    title: "Educational Expo & Conference 2025",
    description: "Join us for an exciting educational expo featuring innovative teaching methods, modern technologies, and interactive sessions with education experts from across the country.",
    fullDescription: "Scholar Educational Campus proudly presents the Educational Expo & Conference 2025 — a landmark event bringing together educators, innovators, and thought leaders from across the nation.\n\nThis full-day conference will feature:\n\n• **Keynote Speeches** by renowned education experts on modern pedagogy and future-ready learning\n• **Interactive Workshops** on integrating technology in classrooms, including AI-powered learning tools\n• **Exhibition Stalls** showcasing the latest educational technology, books, and resources\n• **Panel Discussions** on the National Education Policy and its impact on school education\n• **Student Demonstrations** of science projects, robotics, and innovation labs\n\nThe expo aims to bridge the gap between traditional teaching and modern educational methodologies. Parents, teachers, and students are all welcome to attend and explore new horizons in education.\n\nVenue: Scholar Educational Campus, Main Auditorium\nTime: 9:00 AM - 5:00 PM\nRegistration: Free for all attendees",
    date: "March 15, 2025",
    image: event2Img,
    category: "Conference",
  },
  {
    id: "2",
    title: "Glimpse of Urooj 2025",
    description: "Annual cultural festival celebrating talent, creativity, and the spirit of our students. Music, dance, drama, and art exhibitions await!",
    fullDescription: "Urooj 2025 is the flagship annual cultural festival of Scholar Educational Campus, a grand celebration of talent, creativity, and youthful energy!\n\nThis year's edition promises to be bigger and better with:\n\n• **Music & Dance Performances** — Solo and group performances across classical, folk, and contemporary genres\n• **Drama & Theatre** — Students present original plays and skits on social themes\n• **Art & Craft Exhibition** — Paintings, sculptures, and handmade crafts by budding artists\n• **Literary Events** — Poetry recitation, elocution, debate, and essay writing competitions\n• **Fashion Show** — Students showcase creative costumes themed around Indian culture\n• **Food Festival** — Stalls run by students featuring cuisines from different states\n\nUrooj is not just a festival, it's a platform where every student gets a chance to shine. The event fosters teamwork, confidence, and cultural awareness among students.\n\nVenue: Scholar Educational Campus, Open Ground & Auditorium\nTime: 10:00 AM - 6:00 PM\nOpen for parents and guests",
    date: "February 28, 2025",
    image: event1Img,
    category: "Cultural",
  },
  {
    id: "3",
    title: "POCSO Act 2012 Awareness Workshop",
    description: "Important awareness session about child protection laws and safety measures. A must-attend for parents, teachers, and students.",
    fullDescription: "Scholar Educational Campus organized a crucial awareness workshop on the Protection of Children from Sexual Offences (POCSO) Act, 2012.\n\nThe workshop covered:\n\n• **Understanding POCSO Act** — Detailed explanation of the act, its provisions, and legal framework\n• **Recognizing Signs** — How parents and teachers can identify if a child is in distress\n• **Reporting Mechanisms** — Step-by-step guide on how to report incidents and seek help\n• **Preventive Measures** — Safety tips for children, parents, and educational institutions\n• **Interactive Q&A Session** — Experts answered queries from parents and teachers\n• **Resource Materials** — Handouts and helpline numbers distributed to all attendees\n\nThe session was conducted by legal experts and child psychologists, emphasizing that child safety is a collective responsibility. The workshop reinforced our commitment to creating a safe and nurturing environment for every child.\n\nVenue: Scholar Educational Campus, Conference Hall\nTime: 11:00 AM - 2:00 PM\nAttended by: Parents, Teachers, and Senior Students",
    date: "February 20, 2025",
    image: event4Img,
    category: "Workshop",
  },
  {
    id: "4",
    title: "MESTA Award Ceremony",
    description: "Celebrating excellence in education. Scholar Campus recognized at the prestigious MESTA awards ceremony.",
    fullDescription: "Scholar Educational Campus was honored at the prestigious MESTA (Merit in Education, Science, Technology & Arts) Award Ceremony — a proud moment for our entire campus family!\n\nHighlights of the ceremony:\n\n• **Award Recognition** — Scholar Campus received the award for Excellence in Holistic Education\n• **Chief Guest** — The ceremony was graced by eminent personalities from the education sector\n• **Student Achievers** — Our top-performing students were felicitated for their outstanding academic achievements\n• **Teacher Recognition** — Dedicated teachers were honored for their contribution to quality education\n• **Campus Showcase** — A presentation highlighting our infrastructure, teaching methodology, and student achievements\n\nThis award recognizes our commitment to providing quality education that goes beyond textbooks. It validates our approach of nurturing not just academic excellence, but also character, creativity, and critical thinking.\n\nWe thank all parents, students, and staff for making this achievement possible. This award motivates us to continue striving for excellence in everything we do.\n\nVenue: MESTA Convention Center\nDate: March 5, 2025",
    date: "March 5, 2025",
    image: event3Img,
    category: "Academic",
  },
];
