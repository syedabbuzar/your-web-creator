import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import OptimizedImage from "@/components/OptimizedImage";

interface EventCardProps {
  id?: string;
  title: string;
  description: string;
  date: string;
  image: string;
  className?: string;
  style?: React.CSSProperties;
}

const EventCard = ({ id, title, description, date, image, className, style }: EventCardProps) => {
  const content = (
    <div
      className={cn(
        "card-hover bg-card rounded-lg overflow-hidden shadow-md",
        className
      )}
      style={style}
    >
      <div className="image-zoom h-40 sm:h-48 md:h-56">
        <OptimizedImage
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3 sm:p-4 md:p-5">
        <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-1.5 sm:mb-2">
          {date}
        </p>
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1.5 sm:mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
        <span className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-primary hover:text-accent transition-colors duration-200 nav-link inline-block">
          Read More
        </span>
      </div>
    </div>
  );

  if (id) {
    return <Link to={`/event/${id}`}>{content}</Link>;
  }
  return content;
};

export default EventCard;
