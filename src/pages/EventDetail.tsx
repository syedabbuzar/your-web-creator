import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        try {
          const response = await axiosInstance.get(`/events/${id}`);
          setEvent(response.data);
        } catch {
          const response = await axiosInstance.get("/events");
          const events = Array.isArray(response.data) ? response.data : [];
          const found = events.find((e: any) => (e._id || e.id) === id);
          if (found) setEvent(found);
        }
      } catch {
        toast.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <Layout><section className="py-16 sm:py-20 md:py-28"><div className="container mx-auto px-4 text-center"><p className="text-muted-foreground">Loading...</p></div></section></Layout>;
  }

  if (!event) {
    return (
      <Layout>
        <section className="py-16 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Event Not Found</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">The event you're looking for doesn't exist.</p>
            <Link to="/events"><Button><ArrowLeft className="w-4 h-4 mr-2" /> Back to Events</Button></Link>
          </div>
        </section>
      </Layout>
    );
  }

  const description = event.full_description || event.description || "";
  const images: string[] = Array.isArray(event.images) && event.images.length > 0 ? event.images : (event.image ? [event.image] : []);

  return (
    <Layout>
      {images.length > 0 && (
        <section className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] overflow-hidden">
          <OptimizedImage src={images[activeImg]} alt={event.title} className="w-full h-full object-cover transition-all duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {images.length > 1 && (
            <>
              <button onClick={() => setActiveImg(p => p > 0 ? p - 1 : images.length - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setActiveImg(p => p < images.length - 1 ? p + 1 : 0)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"><ChevronRight className="w-5 h-5" /></button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-2.5 h-2.5 rounded-full transition ${i === activeImg ? "bg-white" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/events" className="inline-flex items-center gap-2 text-primary hover:text-accent mb-6 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs sm:text-sm text-muted-foreground">
            {event.category && <span className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full"><Tag className="w-3 h-3" />{event.category}</span>}
            {event.date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{event.date}</span>}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">{event.title}</h1>

          <div className="prose max-w-none">
            {description.split("\n").map((paragraph: string, idx: number) => {
              if (!paragraph.trim()) return null;
              const parts = paragraph.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={idx} className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-4">
                  {parts.map((part: string, i: number) =>
                    i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part
                  )}
                </p>
              );
            })}
          </div>

          {/* All images gallery */}
          {images.length > 1 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-foreground mb-4">Event Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition" onClick={() => setActiveImg(i)}>
                    <OptimizedImage src={img} alt={`${event.title} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <Link to="/events"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> View All Events</Button></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;
