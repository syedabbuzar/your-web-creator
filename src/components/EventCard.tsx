import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";

interface EventCardProps {
  id?: string;
  title: string;
  description: string;
  date: string;
  image: string;
  images?: string[];
  className?: string;
  style?: React.CSSProperties;
}

const EventCard = ({ id, title, description, date, image, images, className, style }: EventCardProps) => {
  const allImages = images && images.length > 0 ? images : (image ? [image] : []);
  const [activeIdx, setActiveIdx] = useState(0);

  const prevImg = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx(p => (p - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const nextImg = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx(p => (p + 1) % allImages.length);
  }, [allImages.length]);

  const content = (
    <div className={cn("card-hover bg-card rounded-lg overflow-hidden shadow-md", className)} style={style}>
      <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
        <OptimizedImage src={allImages[activeIdx] || ""} alt={title} className="w-full h-full object-cover" loading="lazy" />
        {allImages.length > 1 && (
          <>
            <button onClick={prevImg} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition">
              <ChevronLeft className="w-3 h-3 text-white" />
            </button>
            <button onClick={nextImg} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition">
              <ChevronRight className="w-3 h-3 text-white" />
            </button>
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {allImages.map((_, i) => (
                <button key={i} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveIdx(i); }} className={`w-1.5 h-1.5 rounded-full transition ${i === activeIdx ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-3 sm:p-4 md:p-5">
        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1.5 sm:mb-2">{date}</p>
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1.5 sm:mb-2 line-clamp-2">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{description}</p>
        <span className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-primary hover:text-accent transition-colors duration-200 nav-link inline-block">Read More</span>
      </div>
    </div>
  );

  if (id) return <Link to={`/event/${id}`}>{content}</Link>;
  return content;
};

export default EventCard;
