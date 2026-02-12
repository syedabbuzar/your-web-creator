import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { defaultEvents } from "@/data/events";

const HeroCarousel = () => {
  const events = (() => {
    const saved = localStorage.getItem("scholar_events");
    return saved ? JSON.parse(saved) : defaultEvents;
  })();

  const [current, setCurrent] = useState(0);
  const total = events.length;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-slide (slower)
  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  if (total === 0) return null;

  return (
    <section className="relative w-full h-48 sm:h-56 md:h-72 lg:h-80 xl:h-96 overflow-hidden">
      {/* Slides */}
      {events.map((event: any, index: number) => (
        <Link
          key={event.id}
          to={`/event/${event.id}`}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-20">
            <p className="text-[10px] sm:text-xs md:text-sm text-white/80 uppercase tracking-wider mb-1 sm:mb-2">
              {event.date}
            </p>
            <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-white leading-tight line-clamp-2">
              {event.title}
            </h3>
          </div>
        </Link>
      ))}

      {/* Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); prev(); }}
        className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next(); }}
        className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
        {events.map((_: any, index: number) => (
          <button
            key={index}
            onClick={(e) => { e.preventDefault(); setCurrent(index); }}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
              index === current ? "bg-white w-4 sm:w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
