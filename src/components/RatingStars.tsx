'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  postId: string;
  readOnly?: boolean;
}

export default function RatingStars({ postId, readOnly = false }: RatingStarsProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [totalRatingsCount, setTotalRatingsCount] = useState(0);
  const [average, setAverage] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Wait, let's look up ratings in the localStorage for this post
    const storedRatingsKey = `ratings_${postId}`;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storedRatingsKey);
      const parsed = stored ? JSON.parse(stored) as number[] : [];
      
      const userHasRated = localStorage.getItem(`has_rated_${postId}`);
      if (userHasRated) setHasRated(true);

      if (parsed.length > 0) {
        setTotalRatingsCount(parsed.length);
        const sum = parsed.reduce((a, b) => a + b, 0);
        setAverage(Math.round((sum / parsed.length) * 10) / 10);
      } else {
        // Default seed ratings
        const seed = [5, 4, 5, 5, 4];
        localStorage.setItem(storedRatingsKey, JSON.stringify(seed));
        setTotalRatingsCount(seed.length);
        setAverage(4.6);
      }
    }
  }, [postId, mounted]);

  const handleRate = (value: number) => {
    if (readOnly || hasRated) return;

    const storedRatingsKey = `ratings_${postId}`;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storedRatingsKey);
      const parsed = stored ? JSON.parse(stored) as number[] : [];
      parsed.push(value);
      localStorage.setItem(storedRatingsKey, JSON.stringify(parsed));
      localStorage.setItem(`has_rated_${postId}`, 'true');

      setTotalRatingsCount(parsed.length);
      const sum = parsed.reduce((a, b) => a + b, 0);
      setAverage(Math.round((sum / parsed.length) * 10) / 10);
      setRating(value);
      setHasRated(true);
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center sm:items-start gap-1">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-0.5 text-coffee-light/20">
                <Star className="h-4 w-4" />
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-coffee-dark">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center sm:items-start gap-1">
      <div className="flex items-center gap-1.5">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            const isFull = hoverRating ? starValue <= hoverRating : starValue <= (rating || Math.round(average));
            return (
              <button
                key={index}
                type="button"
                disabled={readOnly || hasRated}
                onClick={() => handleRate(starValue)}
                onMouseEnter={() => !readOnly && !hasRated && setHoverRating(starValue)}
                onMouseLeave={() => !readOnly && !hasRated && setHoverRating(0)}
                className={`p-0.5 transition-colors ${
                  readOnly || hasRated ? 'cursor-default' : 'cursor-pointer'
                } ${isFull ? 'text-terracotta' : 'text-coffee-light/20'}`}
              >
                <Star className={`h-4 w-4 ${isFull ? 'fill-current' : ''}`} />
              </button>
            );
          })}
        </div>
        <span className="text-xs font-bold text-coffee-dark">
          {average > 0 ? average : 'No ratings yet'}
        </span>
        <span className="text-xs text-coffee-light">
          ({totalRatingsCount} {totalRatingsCount === 1 ? 'rating' : 'ratings'})
        </span>
      </div>
      {!readOnly && !hasRated && (
        <span className="text-[10px] text-coffee-light/60">Tap to rate this piece</span>
      )}
      {!readOnly && hasRated && (
        <span className="text-[10px] text-sage font-medium">Thank you for rating!</span>
      )}
    </div>
  );
}
