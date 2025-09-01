import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING, description: 'Creative and appealing name for the recipe.' },
    description: { type: Type.STRING, description: 'A short, enticing description of the dish (2-3 sentences).' },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of ingredients with quantities and units (e.g., "200g chicken breast").'
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Step-by-step cooking instructions.'
    }
  },
  required: ['recipeName', 'description', 'ingredients', 'instructions']
};


export const generateRecipe = async (ingredients: string): Promise<Recipe> => {
  const prompt = `Based on the following ingredients: ${ingredients}. Generate a creative, delicious, halal, and Malaysia-friendly recipe. Provide a unique name for the dish. The response must be in English.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const jsonText = response.text.trim();
    const recipeData: Recipe = JSON.parse(jsonText);
    return recipeData;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Could not get a recipe from the kitchen. Please try again.");
  }
};

export const translateContent = async (content: object, languageName: string): Promise<any> => {
  const prompt = `Translate all string values in the following JSON object to ${languageName}. Do not translate keys. Respond with only the translated JSON object, maintaining the exact same structure and keys. If a value is an array of strings, translate each string in the array.
  
  JSON to translate:
  ${JSON.stringify(content, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error(`Error translating content to ${languageName}:`, error);
    throw new Error(`Failed to translate content. Please try a different language.`);
  }
};