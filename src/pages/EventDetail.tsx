import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { defaultEvents } from "@/data/events";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();

  const events = (() => {
    const saved = localStorage.getItem("scholar_events");
    return saved ? JSON.parse(saved) : defaultEvents;
  })();

  const event = events.find((e: any) => e.id === id);

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

  const description = event.fullDescription || event.description;

  return (
    <Layout>
      {/* Hero Image */}
      <section className="relative">
        <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
      </section>

      {/* Content */}
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
              // Handle bold text with **
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
