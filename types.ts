export type LanguageCode = string;

export interface Language {
  code: LanguageCode;
  name: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
}

// FIX: Added missing ShortenedRecipe type for the sharing feature.
export interface ShortenedRecipe {
  n: string;
  d: string;
  pt: string;
  ct: string;
  tt: string;
  s: string;
  i: string[];
  x: string[];
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
  recipePrepTime: string;
  recipeCookTime: string;
  recipeTotalTime: string;
  recipeServings: string;
  exportTitle: string;
  saveAsText: string;
  saveAsImage: string;
  saveAsPdf: string;
  saveAsImageSaving: string;
  saveAsPdfSaving: string;
  errorPrefix: string;
  errorIngredients: string;
  loadingMessages: string[];
  translatingMessage: string;
  tagline: string;
  usageTips: string[];
  feedbackButton: string;
  feedbackSubject: string;
  // FIX: Added missing UiText properties for the sharing feature.
  shareTitle: string;
  shareInstructions: string;
  copyLinkButton: string;
  linkCopiedButton: string;
  // Added for generation counter
  generationCounterText: string;
  generationCounterTextSingle: string;
}

export type ExportImageLayout = 'mobile' | 'desktop';