import { supabase } from './supabaseClient';

export interface RatingSummary {
    averageRating: number;
    totalRatings: number;
}

export interface UpsertRatingPayload {
    recipeId: string;
    recipeName: string;
    userId: string;
    rating: number;
    languageCode: string;
    ingredients: string[];
}

export const getRecipeRatingSummary = async (recipeId: string): Promise<RatingSummary> => {
    const { data, error } = await supabase
        .from('recipe_rating_summary')
        .select('average_rating, total_ratings')
        .eq('recipe_id', recipeId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: 'The result contains 0 rows'
        console.error('Error fetching rating summary:', error);
        return { averageRating: 0, totalRatings: 0 };
    }

    return {
        averageRating: data?.average_rating ?? 0,
        totalRatings: data?.total_ratings ?? 0,
    };
};

export const getUserRating = async (recipeId: string, userId: string): Promise<{ rating: number } | null> => {
    const { data, error } = await supabase
        .from('recipe_ratings')
        .select('rating')
        .eq('recipe_id', recipeId)
        .eq('user_id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user rating:', error);
    }

    return data;
};

export const upsertRating = async (payload: UpsertRatingPayload) => {
    const { recipeId, recipeName, userId, rating, languageCode, ingredients } = payload;
    
    const { error } = await supabase.from('recipe_ratings').upsert(
        {
            recipe_id: recipeId,
            recipe_name: recipeName,
            user_id: userId,
            rating: rating,
            language_code: languageCode,
            ingredients: ingredients,
            updated_at: new Date().toISOString(),
        },
        { onConflict: 'recipe_id,user_id' }
    );

    if (error) {
        console.error('Error upserting rating:', error);
        throw new Error('Could not submit your rating.');
    }
};
