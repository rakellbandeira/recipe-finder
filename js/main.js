
document.addEventListener('DOMContentLoaded', async () => {
    const edamamAPI = new EdamamAPI();
    const foodFactsAPI = new OpenFoodFactsAPI();

    // Test Edamam API
    try {
        const edamamAPI = new EdamamAPI();
        console.log('Testing Edamam API...');
        const recipes = await edamamAPI.searchRecipes("pizza");
        console.log('Edamam recipes:', recipes);
    } catch (error) {
        console.error('Edamam API error:', error);
    }

    // Test OpenFoodFacts API
    try {
        const ingredientInfo = await foodFactsAPI.getIngredientInfo('banana');
        console.log('OpenFoodFacts info:', ingredientInfo);
    } catch (error) {
        console.error('OpenFoodFacts API error:', error);
    }
});