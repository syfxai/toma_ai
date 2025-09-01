import React, { useState } from 'react';
import type { UiText, Recipe } from '../types';
import StarIcon from './icons/StarIcon';

interface RatingProps {
  recipe: Recipe;
  uiText: UiText;
  onRatingSubmit: (recipeId: string, recipeName: string, rating: number) => Promise<void>;
}

const Rating: React.FC<RatingProps> = ({ recipe, uiText, onRatingSubmit }) => {
  const [userRating, setUserRating] = useState(recipe.userRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!recipe.userRating);

  const handleSubmit = async () => {
    if (userRating === 0) return;
    setIsSubmitting(true);
    try {
      await onRatingSubmit(recipe.id, recipe.recipeName, userRating);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Failed to submit rating.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRatingText = uiText.ratingAverage(recipe.averageRating ?? 0, recipe.totalRatings ?? 0);

  return (
    <div className="text-center my-8 py-6 border-y border-gray-200/80">
      <h4 className="text-sm font-bold uppercase text-gray-500 tracking-wider mb-4">{uiText.ratingTitle}</h4>
      { (recipe.totalRatings ?? 0) > 0 && <p className="text-gray-600 mb-3">{averageRatingText}</p>}
      
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center space-x-1 text-amber-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              disabled={isSubmitting || submitted}
              onClick={() => setUserRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none"
              aria-label={`Rate ${star} star`}
            >
              <StarIcon
                isFilled={(hoverRating || userRating) >= star}
                className="w-8 h-8 transition-transform duration-150 hover:scale-125"
              />
            </button>
          ))}
        </div>

        {submitted ? (
           <p className="font-semibold text-emerald-700">{uiText.ratingThankYou}</p>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || userRating === 0}
            className="mt-2 px-6 py-2 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? uiText.ratingSubmitting : uiText.ratingSubmit}
          </button>
        )}
      </div>
    </div>
  );
};

export default Rating;
