import React from 'react';
import type { UiText } from '../types';

interface IngredientInputProps {
  ingredients: string;
  onIngredientsChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  uiText: UiText;
}

const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onIngredientsChange,
  onGenerate,
  isLoading,
  uiText,
}) => {

  return (
    <div className="w-full">
      <label htmlFor="ingredients" className="block text-lg font-semibold text-gray-800 mb-2">
        {uiText.inputLabel}
      </label>
      <textarea
        id="ingredients"
        value={ingredients}
        onChange={(e) => onIngredientsChange(e.target.value)}
        placeholder={uiText.inputPlaceholder}
        className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow duration-200 resize-none text-gray-800 bg-white"
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-5 w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
      >
        {isLoading ? uiText.generateButtonLoading : uiText.generateButton}
      </button>
    </div>
  );
};

export default IngredientInput;