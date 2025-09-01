export type LanguageCode = string;

export interface Language {
  code: LanguageCode;
  name: string;
}

export interface GeneratedRecipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

export interface Recipe extends GeneratedRecipe {
  id: string;
  averageRating?: number;
  totalRatings?: number;
  userRating?: number;
}

export interface UiText {
  headerTitle: string;
  headerSubtitle: string;
  inputLabel: string;
  inputPlaceholder: string;
  generateButton: string;
  generateButtonLoading: string;
  resetButton: string;
  recipeIngredients: string;
  recipeInstructions: string;
  exportTitle: string;
  saveAsText: string;
  saveAsImage: string;
  saveAsImageSaving: string;
  share: string;
  shareCopied: string;
  errorPrefix: string;
  errorIngredients: string;
  loadingMessageRecipe: string;
  // New rating UI text
  ratingTitle: string;
  ratingAverage: (rating: number, count: number) => string;
  ratingYourRating: string;
  ratingThankYou: string;
  ratingSubmit: string;
  ratingSubmitting: string;
}
