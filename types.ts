export type LanguageCode = string;

export interface Language {
  code: LanguageCode;
  name: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
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
}