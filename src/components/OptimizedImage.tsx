import { useState, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='.3em' fill='%2394a3b8' font-family='Arial' font-size='14'%3EImage unavailable%3C/text%3E%3C/svg%3E";

const OptimizedImage = ({ src, alt, className, fallback, loading = "lazy", ...props }: OptimizedImageProps) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) setError(true);
  };

  const imgSrc = error ? (fallback || FALLBACK_IMG) : src;

  return (
    <img
      src={imgSrc}
      alt={alt || ""}
      className={cn(className)}
      loading={loading}
      onError={handleError}
      decoding="async"
      {...props}
    />
  );
};

export default OptimizedImage;
