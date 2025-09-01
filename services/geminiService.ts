import { GoogleGenAI } from "@google/genai";
import type { GeneratedRecipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = (text: string): GeneratedRecipe => {
  // Find the JSON block, which might be wrapped in markdown or have leading/trailing text
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Invalid JSON response from the AI model.");
  }
  return JSON.parse(match[0]);
};

export const generateRecipe = async (ingredients: string): Promise<GeneratedRecipe> => {
  const prompt = `You are an expert Malaysian home cook, passionate about creating authentic and delicious local dishes. Your primary task is to analyze the provided ingredients and determine the **most logical and delicious type of Malaysian dish** to create. Use your culinary judgment.

**Provided Ingredients:**
${ingredients}

**Strict Requirements:**
1.  **Context is Key - Choose the Right Dish Type:**
    *   Analyze the ingredients first. Do they suggest a savory main course, a sweet snack, a dessert, or a drink?
    *   **If savory** (e.g., chicken, fish, vegetables, spices), create a 'lauk-pauk' (a main or side dish) that is typically eaten with rice. For these dishes, consider Malaysian cooking styles like 'tumis' (sautéing), 'gulai' (curry), 'masak lemak' (coconut milk-based), 'sambal', 'sup' (soup), 'bakar' (grilling), or 'kukus' (steaming).
    *   **If sweet** (e.g., flour, coconut, sugar, palm sugar), create a 'kuih-muih' (traditional cake/snack), 'cucur' (fritter), or a dessert. Do NOT classify these as a 'lauk' for rice.
    *   **Use common sense:** Avoid illogical combinations. A sweet coconut fritter should not be spicy or described as a main course for rice.

2.  **Strictly Halal:** The recipe MUST be 100% halal. This is a critical, non-negotiable requirement. No pork, alcohol, or any non-halal ingredients or methods.

3.  **Creative & Appealing Name:** Devise a creative and appealing name for the dish in English. Do not just list the ingredients. For example, instead of "Chicken Fried with Turmeric," a better name would be "Golden Turmeric Fried Chicken." For a sweet fritter, "Sweet Coconut Fritters" or "Jemput-Jemput Kelapa Manis" are more authentic and preferred.

4.  **Practical for Home Cooks:** Instructions must be clear, step-by-step, and easy for a Malaysian home cook to follow.

5.  **Language:** The recipe and all text must be in **English**.

**Output Format:**
You MUST respond with ONLY a single JSON object that strictly adheres to the following structure. Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON object.

{
  "recipeName": "string",
  "description": "string (A short, enticing description of the dish, 2-3 sentences, highlighting its character and appropriate context, e.g., 'a perfect tea-time snack' or 'a rich curry that pairs beautifully with steamed rice')",
  "ingredients": ["string", "string", ...],
  "instructions": ["string", "string", ...]
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const jsonText = response.text.trim();
    const recipeData: GeneratedRecipe = parseJsonResponse(jsonText);
    return recipeData;
  } catch (error) {
    console.error("Error generating recipe:", error);
     if (error instanceof SyntaxError) { // This happens if JSON.parse fails
      throw new Error("The kitchen returned a malformed recipe card. Please try again.");
    }
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