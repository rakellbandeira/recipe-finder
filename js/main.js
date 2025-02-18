document.addEventListener('DOMContentLoaded', async () => {
    const edamamAPI = new EdamamAPI();
    const foodFactsAPI = new OpenFoodFactsAPI();
    try {
      const categoryManager = new CategoryManager();
      const favoritesManager = new FavoritesManager();
      
      setupPantryToggle();
      setupHomeButton();

  } catch (error) {
      console.error('Initialization error:', error);
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
  
  recipesContainer.innerHTML = '';
  
  if (favorites.length === 0) {
      recipesContainer.innerHTML = '<p class="no-favorites">No favorite recipes yet</p>';
      return;
  }
  
  favorites.forEach(recipe => {
      const recipeBox = createRecipeBox({ recipe });
      recipesContainer.appendChild(recipeBox);
  });
}



function setupHomeButton() {
  // Setup mobile home button
  const mobileHomeBtn = document.querySelector('.nav-item[data-view="home"]');
  if (mobileHomeBtn) {
      mobileHomeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          returnToHome();
      });
  }

  // Setup desktop logo home button
  const logoTitle = document.querySelector('.logo-title');
  if (logoTitle) {
      logoTitle.style.cursor = 'pointer';
      logoTitle.addEventListener('click', returnToHome);
  }
}

function returnToHome() {
  // Close pantry if open
  const pantryPanel = document.querySelector('.pantry');
  if (pantryPanel.classList.contains('show')) {
      pantryPanel.classList.remove('show');
      const pantryButton = document.querySelector('.nav-item[data-view="pantry"]');
      if (pantryButton) {
          pantryButton.classList.remove('active');
      }
  }

  // Remove active state from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
  });

  // Set home button as active in mobile view
  const homeButton = document.querySelector('.nav-item[data-view="home"]');
  if (homeButton && window.innerWidth <= 992) {
      homeButton.classList.add('active');
  }

  // Return to recipe view if ingredients are selected
  const recipesContainer = document.getElementById('recipes');
  recipesContainer.dataset.view = 'regular';

  if (activeIngredients.size > 0) {
      searchRecipesWithCurrentIngredients();
  } else {
      recipesContainer.innerHTML = '';
      const actIngred = document.getElementById('activeIngred');
      if (actIngred) {
          actIngred.innerHTML = 'Select ingredients to find recipes';
      }
  }
}


