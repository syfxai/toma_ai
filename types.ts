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

export interface FeedbackData {
  rating: number;
  name: string;
  email: string;
  comment: string;
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
  feedbackSubject: string; // Kept for backward compatibility or internal use
  shareTitle: string;
  shareInstructions: string;
  copyLinkButton: string;
  linkCopiedButton: string;
  generationCounterText: string;
  generationCounterTextSingle: string;
  
  // New Feedback Form Text
  feedbackTitle: string;
  feedbackSubtitle: string;
  labelName: string;
  labelEmail: string;
  labelRating: string;
  labelComment: string;
  placeholderName: string;
  placeholderEmail: string;
  placeholderComment: string;
  submitFeedbackButton: string;
  submittingFeedback: string;
  feedbackSuccessTitle: string;
  feedbackSuccessMessage: string;
  closeButton: string;
}

export type ExportImageLayout = 'mobile' | 'desktop';