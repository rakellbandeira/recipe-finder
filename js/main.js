/* const headerTemplate = `
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
            <img src="./assets/images/logo/logo.png" alt="Logo" width="80">
            <h1 class="title-logo">My Pantry</h1><span>|</span>
            <h3>Your fastest recipe finder</h3>
          </div>

          <div class="favoritesButton">
            <a><img src="./assets/images/1.png" alt="heart" width="40" ><p id="favoritesButtonText" >See Favorites</p></a>
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
 */


document.addEventListener('DOMContentLoaded', async () => {
    const edamamAPI = new EdamamAPI();
    const foodFactsAPI = new OpenFoodFactsAPI();
    try {
      const categoryManager = new CategoryManager();
      const favoritesManager = new FavoritesManager();
      
      // Initialize mobile navigation if needed
     /*  if (window.innerWidth < 992) {
          initializeMobileNav();
      }
 */
      setupPantryToggle();

  } catch (error) {
      console.error('Initialization error:', error);
  }


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

    
    if (window.innerWidth < 992) {
      const pantry = document.querySelector('.pantry');
      const toggleButton = document.createElement('button');
      toggleButton.className = 'toggle-pantry';
      toggleButton.innerHTML = '>';
      toggleButton.onclick = () => pantry.classList.toggle('expanded');
      pantry.appendChild(toggleButton);
  }


  const favoritesToggle = document.querySelector('.favorites-toggle');
  if (favoritesToggle) {
    favoritesToggle.addEventListener('click', toggleFavoritesView);
  }
});

  function setupPantryToggle() {
    const pantryPanel = document.querySelector('.pantry');
    const pantryButton = document.querySelector('.nav-item[data-view="pantry"]');
    
    if (!pantryPanel || !pantryButton) return;
    
    pantryButton.addEventListener('click', (e) => {
        e.preventDefault();
        pantryPanel.classList.toggle('show');
        pantryButton.classList.toggle('active');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.pantry') && 
            !e.target.closest('.nav-item[data-view="pantry"]') && 
            pantryPanel.classList.contains('show')) {
            pantryPanel.classList.remove('show');
            pantryButton.classList.remove('active');
        }
    });
}

// Add media query listener to handle desktop transition
const mediaQuery = window.matchMedia('(min-width: 992px)');
mediaQuery.addListener(handleViewportChange);

function handleViewportChange(e) {
    const pantryPanel = document.querySelector('.pantry');
    if (e.matches) {
        // Reset mobile-specific classes when switching to desktop
        pantryPanel.classList.remove('show');
        const activeButton = document.querySelector('.nav-item.active');
        if (activeButton) {
            activeButton.classList.remove('active');
        }
    }
}


function toggleFavoritesView() {
  const recipesContainer = document.getElementById('recipes');
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

   

  
  if (recipesContainer.dataset.view === 'favorites') {
      // Switch back to regular view
      recipesContainer.dataset.view = 'regular';
      searchRecipesWithCurrentIngredients();
  } else {
      // Show favorites
      recipesContainer.dataset.view = 'favorites';
      recipesContainer.innerHTML = '';

      if (favorites.length === 0) {
          recipesContainer.innerHTML = '<p class="no-favorites">No favorite recipes yet</p>';
      } else {
          
          favorites.forEach(recipe => {
               const recipeBox = createRecipeBox({ recipe });
        // Set favorite button to active state for favorites view
        const favBtn = recipeBox.querySelector('.favorite-btn img');
        if (favBtn) {
            favBtn.src = './assets/images/heart1.png';
        }
        recipesContainer.appendChild(recipeBox);
          });
      }
  }
}


