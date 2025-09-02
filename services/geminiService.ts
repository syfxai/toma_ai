import { GoogleGenAI } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = (text: string): Recipe => {
  // Find the JSON block, which might be wrapped in markdown or have leading/trailing text
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Invalid JSON response from the AI model.");
  }
  const recipe: Recipe = JSON.parse(match[0]);
  
  const cleanCitations = (str: string) => str.replace(/\s*\[[\d,\s]+\]/g, '').trim();

  // Clean all user-facing text fields from any bracketed citations like [1], [2, 13], etc.
  if (recipe.recipeName) {
    recipe.recipeName = cleanCitations(recipe.recipeName);
  }
  if (recipe.description) {
    recipe.description = cleanCitations(recipe.description);
  }
  if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
    recipe.ingredients = recipe.ingredients.map(cleanCitations);
  }
  if (recipe.instructions && Array.isArray(recipe.instructions)) {
    recipe.instructions = recipe.instructions.map(cleanCitations);
  }

  return recipe;
};

export const generateRecipe = async (ingredients: string): Promise<Recipe> => {
  const prompt = `You are an expert culinary AI, skilled at both providing specific recipes and creating new ones from ingredients. Your primary goal is to help a Malaysian home cook.

**Analyze the user's input first to determine its type:**
1.  **Is it a request for a specific, named dish?** (e.g., "resepi rotiboy", "Nasi Lemak recipe", "how to make chocolate cake").
2.  **Or is it a list of raw ingredients?** (e.g., "chicken, soy sauce, ginger", "flour, sugar, eggs").

**Follow these instructions based on your analysis:**

---

### **Scenario A: If the user requests a SPECIFIC DISH**

1.  **Provide the Recipe Directly:** Your main task is to provide an excellent, authentic, and reliable recipe for the requested dish.
2.  **Use Web Search:** Leverage your web search tool to find the best and most popular versions of this recipe to ensure accuracy and quality.
3.  **Creative Name & Description:** Even for a known dish, give it an appealing name (e.g., "Classic Malaysian Nasi Lemak" or "Fluffy Mexican Coffee Buns") and a great description.

---

### **Scenario B: If the user provides a LIST OF INGREDIENTS**

1.  **Determine the Best Dish:** Analyze the ingredients to create the most logical and delicious Malaysian dish possible.
2.  **Context is Key:**
    *   **Savory ingredients** (e.g., chicken, fish, spices) should become a 'lauk-pauk' (main/side dish) for rice. Think 'tumis', 'gulai', 'sambal', etc.
    *   **Sweet ingredients** (e.g., flour, coconut, sugar) should become a 'kuih-muih', 'cucur', or dessert.
    *   **Use common sense:** Avoid illogical combinations. A sweet coconut fritter should not be spicy.
3.  **Creative & Appealing Name:** Devise a creative name for the dish. For example, from "Chicken, Turmeric," create "Golden Turmeric Fried Chicken."

---

### **Universal Requirements (Apply to BOTH scenarios):**

*   **Strictly Halal:** All recipes MUST be 100% halal. No pork, alcohol, or non-halal ingredients/methods. This is non-negotiable.
*   **Practical for Home Cooks:** Instructions must be clear, step-by-step, and easy for a home cook to follow.
*   **Language:** The entire JSON output, including recipe name, description, etc., must be in **English**.

**Output Format:**
You MUST respond with ONLY a single JSON object that strictly adheres to the following structure. Do not include any text, explanations, or markdown formatting like \`\`\`json before or after the JSON object.

{
  "recipeName": "string",
  "description": "string (A short, enticing description of the dish, 2-3 sentences)",
  "ingredients": ["string", "string", ...],
  "instructions": ["string", "string", ...]
}

**User's Input:**
${ingredients}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const jsonText = response.text.trim();
    const recipeData: Recipe = parseJsonResponse(jsonText);
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
  const prompt = `Translate all string values in the following JSON object to ${languageName}. The context is a food recipe, so be natural and use appropriate culinary terms for that language. Do not translate keys. Respond with only the translated JSON object, maintaining the exact same structure and keys. If a value is an array of strings, translate each string in the array.
  
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
    // FIX: Corrected typo from `jsontext` to `jsonText`.
    return JSON.parse(jsonText);
  } catch (error) {
    console.error(`Error translating content to ${languageName}:`, error);
    throw new Error(`Failed to translate content. Please try a different language.`);
  }
};