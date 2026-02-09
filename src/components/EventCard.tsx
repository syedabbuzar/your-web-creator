import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  description: string;
  date: string;
  image: string;
  className?: string;
  style?: React.CSSProperties;
}

const EventCard = ({ title, description, date, image, className, style }: EventCardProps) => {
  return (
    <div
      className={cn(
        "card-hover bg-card rounded-lg overflow-hidden shadow-md",
        className
      )}
      style={style}
    >
      <div className="image-zoom h-48 md:h-56">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
          {date}
        </p>
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {description}
        </p>
        <button className="mt-4 text-sm font-semibold text-primary hover:text-accent transition-colors duration-200 nav-link">
          Read More
        </button>
      </div>
    </div>
  );
};

export default EventCard;
