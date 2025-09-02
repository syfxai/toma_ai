import React, { useState, useCallback } from 'react';
import type { Language, Recipe, UiText, LanguageCode } from './types';
import { generateRecipe, translateContent } from './services/geminiService';
import Header from './components/Header';
import LanguageSelector from './components/LanguageToggle';
import IngredientInput from './components/IngredientInput';
import RecipeDisplay from './components/RecipeDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';

const LANGUAGES: Language[] = [
  { code: 'ms', name: 'Bahasa Melayu' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'zh', name: '中文 (Mandarin)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'ar', name: 'العربية (Arabic)' },
];

const DEFAULT_UI_TEXT_EN: UiText = {
  headerTitle: "Toma",
  headerSubtitle: "No idea what to cook? Let Toma do the work!",
  inputLabel: "What ingredients do you have?",
  inputPlaceholder: "e.g., chicken, soy sauce, ginger, garlic...",
  generateButton: "Generate Recipe",
  generateButtonLoading: "Generating...",
  resetButton: "Reset",
  recipeIngredients: "Ingredients",
  recipeInstructions: "Instructions",
  exportTitle: "Export Recipe",
  saveAsText: "Save as Text",
  saveAsImage: "Save as Image",
  saveAsImageSaving: "Saving...",
  share: "Share",
  shareCopied: "Copied!",
  sharePreparing: "Preparing Share...",
  errorPrefix: "Failed to generate recipe:",
  errorIngredients: "Please enter some ingredients.",
  loadingMessages: [
    "The AI Chef is thinking...",
    "Chopping onions and chillies...",
    "Heating up the pan...",
    "Finding inspiration at the market...",
    "Checking the secret recipe book...",
    "Almost ready!"
  ],
  translatingMessage: "Translating...",
};

const DEFAULT_UI_TEXT_MS: UiText = {
  headerTitle: "Toma",
  headerSubtitle: "Tiada idea nak masak apa? Biar Toma bantu!",
  inputLabel: "Apakah bahan-bahan yang anda ada?",
  inputPlaceholder: "Cth: ayam, kicap, halia, bawang putih...",
  generateButton: "Jana Resepi",
  generateButtonLoading: "Sedang menjana...",
  resetButton: "Set Semula",
  recipeIngredients: "Bahan-Bahan",
  recipeInstructions: "Cara Penyediaan",
  exportTitle: "Eksport Resepi",
  saveAsText: "Simpan sebagai Teks",
  saveAsImage: "Simpan sebagai Imej",
  saveAsImageSaving: "Sedang menyimpan...",
  share: "Kongsi",
  shareCopied: "Telah disalin!",
  sharePreparing: "Menyediakan...",
  errorPrefix: "Gagal menjana resepi:",
  errorIngredients: "Sila masukkan bahan-bahan anda.",
  loadingMessages: [
    "Chef AI sedang berfikir...",
    "Meracik bawang dan cili...",
    "Memanaskan kuali...",
    "Mencari ilham di pasar tani...",
    "Menyemak buku resepi rahsia...",
    "Hampir siap!"
  ],
  translatingMessage: "Menterjemah...",
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<LanguageCode>('ms');
  const [uiText, setUiText] = useState<UiText>(DEFAULT_UI_TEXT_MS);
  const [ingredients, setIngredients] = useState<string>('');
  
  const [originalRecipe, setOriginalRecipe] = useState<Recipe | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = useCallback(async (newLangCode: LanguageCode) => {
    if (newLangCode === language) return;

    setLanguage(newLangCode);
    const targetLanguage = LANGUAGES.find(l => l.code === newLangCode);
    if (!targetLanguage) return;

    setIsTranslating(true);
    try {
      if (newLangCode === 'en') {
        setUiText(DEFAULT_UI_TEXT_EN);
        if (originalRecipe) setRecipe(originalRecipe);
      } else {
        const contentToTranslate = {
          ...DEFAULT_UI_TEXT_EN,
          ...(originalRecipe || {})
        };
        
        const translatedContent = await translateContent(contentToTranslate, targetLanguage.name);

        const newUiText: Partial<UiText> = {};
        for (const key in DEFAULT_UI_TEXT_EN) {
          if (translatedContent[key]) {
            (newUiText as any)[key] = translatedContent[key];
          }
        }
        setUiText(newUiText as UiText);

        if (originalRecipe) {
          const newRecipe: Partial<Recipe> = {};
           for (const key in originalRecipe) {
            if (translatedContent[key]) {
              (newRecipe as any)[key] = translatedContent[key];
            }
          }
          setRecipe(newRecipe as Recipe);
        }
      }
    } catch(e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Translation failed: ${errorMessage}`);
    } finally {
      setIsTranslating(false);
    }
  }, [language, originalRecipe]);

  const handleGenerateRecipe = useCallback(async () => {
    if (!ingredients.trim()) {
      setError(uiText.errorIngredients);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipe(null);
    setOriginalRecipe(null);
    
    try {
      const generatedRecipe = await generateRecipe(ingredients);
      setOriginalRecipe(generatedRecipe);

      if (language === 'en') {
        setRecipe(generatedRecipe);
      } else {
        const targetLanguage = LANGUAGES.find(l => l.code === language);
        if (targetLanguage) {
            const translatedRecipe = await translateContent(generatedRecipe, targetLanguage.name);
            setRecipe(translatedRecipe);
        } else {
            setRecipe(generatedRecipe); // Fallback to english
        }
      }
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`${uiText.errorPrefix} ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, uiText, language]);

  const handleReset = () => {
    setIngredients('');
    setRecipe(null);
    setOriginalRecipe(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 text-gray-800 antialiased flex flex-col">
      <div className="absolute top-0 right-0 p-4 z-10">
        <LanguageSelector 
          currentLanguage={language} 
          languages={LANGUAGES}
          onChange={handleLanguageChange}
          isDisabled={isTranslating}
        />
      </div>
      <main className="container mx-auto px-4 py-12 md:py-20 flex-grow">
        <Header title={uiText.headerTitle} subtitle={uiText.headerSubtitle} />
        
        <div className="max-w-2xl mx-auto mt-10 bg-white/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-white/80">
          <IngredientInput
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
            onGenerate={handleGenerateRecipe}
            onReset={handleReset}
            isLoading={isLoading}
            uiText={uiText}
          />

          {error && <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>}
        </div>

        {(isLoading || isTranslating) && <LoadingSpinner messages={isLoading ? uiText.loadingMessages : [uiText.translatingMessage]} />}

        {recipe && !isLoading && (
          <RecipeDisplay 
            recipe={recipe} 
            uiText={uiText}
          />
        )}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default App;