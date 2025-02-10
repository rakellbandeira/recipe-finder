const headerTemplate = `
    <header>
    
        <div class="left-area">
          <div class="menu">
            <div class="menu-option" id="home-option" onclick="toggleDisplay('recipe-area')">
              <img src="./assets/images/home-icon.png" alt="Home">
              <span>Home</span>
            </div>
            
            <div class="menu-option" id="pantry-option" onclick="toggleDisplay('pantry')">
              <img src="./assets/images/fridge-icon.png" alt="My Pantry">
              <span>My Pantry</span>
              
            </div>
          </div>
    
          
        </div>
        <div class="header-title">       
          <div class="title">
            <h1>Recipe Wizard |</h1>
            <h3>Your fastest recipe finder</h3>
          </div>

          <div class="favoritesButton">
            <a><img src="" alt="heart">See Favorites</a>
          </div>
        </div>

    
</header>
`;

const footerTemplate = `
    <footer>
    <p>WDD 330: Web Frontend Development II - Final Project</p>
    <p>Rakell Bandeira - 2025</p>
</footer>
`;




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
    /* const headerResponse = await fetch ("../js/public/header.html");
    const headerHtml = await headerResponse.text(); */
    document.body.insertAdjacentHTML('afterbegin', headerTemplate);

    /* const footerResponse = await fetch ("../js/public/footer.html");
    const footerHtml = await footerResponse.text(); */
    document.body.insertAdjacentHTML('beforeend', footerTemplate);
}