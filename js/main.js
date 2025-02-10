document.addEventListener('DOMContentLoaded', async () => {
    const edamamAPI = new EdamamAPI();
    const foodFactsAPI = new OpenFoodFactsAPI();

    // Test Edamam API
    try {
        //console.log('Testing Edamam API...');
        const recipes = await edamamAPI.searchRecipes("");
        //console.log('Edamam recipes:', recipes);
        
    } catch (error) {
        console.error('Edamam API error:', error);
    }

    // Test OpenFoodFacts API
    try {
        const ingredientInfo = await foodFactsAPI.getIngredientInfo('banana');
        //console.log('OpenFoodFacts info:', ingredientInfo);
    } catch (error) {
        console.error('OpenFoodFacts API error:', error);
    }

    loadHeaderAndFooter();
});

async function loadHeaderAndFooter() {
    const headerResponse = await fetch ("../js/public/header.html");
    const headerHtml = await headerResponse.text();
    document.body.insertAdjacentHTML('afterbegin', headerHtml);

    const footerResponse = await fetch ("../js/public/footer.html");
    const footerHtml = await footerResponse.text();
    document.body.insertAdjacentHTML('beforeend', footerHtml);
}