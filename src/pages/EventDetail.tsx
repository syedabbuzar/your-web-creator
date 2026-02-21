import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await supabase.from("events").select("*").eq("id", id).single();
      setEvent(data);
      if (data) {
        const { data: imgs } = await supabase.from("event_images").select("*").eq("event_id", data.id).order("sort_order");
        const allImages = [data.image, ...(imgs || []).map((i: any) => i.image_url)];
        setImages(allImages);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <section className="py-16 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <section className="py-16 sm:py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-4">Event Not Found</h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">The event you're looking for doesn't exist.</p>
            <Link to="/events">
              <Button className="bg-primary text-primary-foreground rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
              </Button>
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const description = event.full_description || event.description;
  const totalImages = images.length;

  return (
    <Layout>
      <section className="relative">
        <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden relative">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${event.title} - ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === currentImg ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          {totalImages > 1 && (
            <>
              <button onClick={() => setCurrentImg((p) => (p - 1 + totalImages) % totalImages)} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button onClick={() => setCurrentImg((p) => (p + 1) % totalImages)} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center">
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {images.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentImg(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === currentImg ? "bg-white w-5" : "bg-white/50"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/events" className="inline-flex items-center text-sm text-primary hover:text-accent transition-colors mb-4 sm:mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Events
          </Link>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium">
              <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {event.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs sm:text-sm">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {event.date}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            {event.title}
          </h1>

          <div className="prose prose-sm sm:prose-base max-w-none">
            {description.split("\n").map((paragraph: string, idx: number) => {
              if (!paragraph.trim()) return null;
              const parts = paragraph.split(/\*\*(.*?)\*\*/g);
              return (
                <p key={idx} className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                  {parts.map((part: string, i: number) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="text-foreground font-semibold">{part}</strong>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            })}
          </div>

          {totalImages > 1 && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3">Event Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => { setCurrentImg(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`rounded-lg overflow-hidden border-2 transition-all ${idx === currentImg ? "border-primary" : "border-transparent"}`}>
                    <img src={img} alt={`${event.title} ${idx + 1}`} className="w-full h-24 sm:h-32 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 sm:mt-10 pt-6 border-t border-border">
            <Link to="/events">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6 sm:px-8 text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" /> View All Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;