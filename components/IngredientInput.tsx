import React from 'react';
import type { UiText } from '../types';

interface IngredientInputProps {
  ingredients: string;
  onIngredientsChange: (value: string) => void;
  onGenerate: () => void;
  onReset: () => void;
  isLoading: boolean;
  uiText: UiText;
}

const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  onIngredientsChange,
  onGenerate,
  onReset,
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
      <div className="mt-5 w-full flex items-center gap-3">
        <button
          onClick={onReset}
          disabled={isLoading || !ingredients}
          className="w-auto px-6 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {uiText.resetButton}
        </button>
        <button
          onClick={onGenerate}
          disabled={isLoading || !ingredients}
          className="flex-grow bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 transform hover:-translate-y-1 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
        >
          {isLoading ? uiText.generateButtonLoading : uiText.generateButton}
        </button>
      </div>
    </div>
  );
};

export default IngredientInput;