import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, reviewCount, size = 'sm' }: StarRatingProps) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(i => {
          const filled = i <= Math.floor(rating);
          const partial = !filled && i <= rating + 0.5;
          return (
            <Star
              key={i}
              className={`${starSize} ${filled || partial ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
            />
          );
        })}
      </div>
      <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-400">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
