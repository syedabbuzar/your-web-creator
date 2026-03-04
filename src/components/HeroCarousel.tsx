import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import axiosInstance from "@/lib/axios";

const getEventId = (event: any) => event?._id || event?.id;
const extractEvents = (payload: any) => payload?.events || payload?.data || payload || [];

const HeroCarousel = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/events");
        const list = extractEvents(response.data);
        setEvents(Array.isArray(list) ? list.slice(0, 6) : []);
      } catch {
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const total = events.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % (total || 1));
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + (total || 1)) % (total || 1));
  }, [total]);

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, total]);

  if (total === 0) return null;

  return (
    <section className="relative w-full h-[200px] sm:h-[280px] md:h-[380px] lg:h-[450px] xl:h-[520px] overflow-hidden">
      {events.map((event: any, index: number) => {
        const eventId = getEventId(event);
        return (
          <Link
            key={eventId || index}
            to={eventId ? `/event/${eventId}` : "/events"}
            className={`absolute inset-0 transition-opacity duration-700 ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <OptimizedImage
              src={event.image}
              alt={event.title || "Event"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 z-20">
              <h3 className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-primary-foreground drop-shadow-lg line-clamp-2">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-xs sm:text-sm md:text-base text-primary-foreground/80 mt-1 sm:mt-2 line-clamp-2 drop-shadow">
                  {event.description}
                </p>
              )}
            </div>
          </Link>
        );
      })}
      {total > 1 && (
        <>
          <button onClick={(e) => { e.preventDefault(); prev(); }} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/70 flex items-center justify-center hover:bg-background transition">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          <button onClick={(e) => { e.preventDefault(); next(); }} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background/70 flex items-center justify-center hover:bg-background transition">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
            {events.map((_, i) => (
              <button key={i} onClick={(e) => { e.preventDefault(); setCurrent(i); }} className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition ${i === current ? "bg-primary-foreground" : "bg-primary-foreground/40"}`} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;
