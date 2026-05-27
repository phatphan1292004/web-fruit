import { FiStar } from 'react-icons/fi';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const StarRating = ({ rating, maxStars = 5, size = 'md', showValue = false }: StarRatingProps) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxStars }, (_, i) => (
          <FiStar
            key={i}
            className={`${sizeMap[size]} ${
              i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-slate-500 font-medium ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
