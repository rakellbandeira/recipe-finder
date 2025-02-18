class FavoritesManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Get both mobile nav and header favorites buttons
        const mobileNavFavorites = document.querySelector('.nav-item[data-view="favorites"]');
        
        if (mobileNavFavorites) {
            mobileNavFavorites.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFavoritesView();
            });
        }
    }

    toggleFavoritesView() {
        const recipesContainer = document.getElementById('recipes');
        const favoritesButton = document.querySelector('.nav-item[data-view="favorites"]');
        
        if (recipesContainer.dataset.view === 'favorites') {
            // Switch back to regular view
            recipesContainer.dataset.view = 'regular';
            if (favoritesButton) {
                favoritesButton.classList.remove('active');
            }
            searchRecipesWithCurrentIngredients();
        } else {
            // Switch to favorites view
            recipesContainer.dataset.view = 'favorites';
            if (favoritesButton) {
                favoritesButton.classList.add('active');
            }
            this.displayFavorites();
        }
    }

    displayFavorites() {
        const recipesContainer = document.getElementById('recipes');
        recipesContainer.innerHTML = '';
        
        if (this.favorites.length === 0) {
            recipesContainer.innerHTML = '<div class="no-favorites">No favorite recipes yet</div>';
            return;
        }

        this.favorites.forEach(recipe => {
            const recipeCard = createRecipeBox({ recipe });
            recipesContainer.appendChild(recipeCard);
        });
    }

    addFavorite(recipe) {
        if (!this.favorites.find(f => f.url === recipe.url)) {
            this.favorites.push(recipe);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    removeFavorite(recipeUrl) {
        this.favorites = this.favorites.filter(f => f.url !== recipeUrl);
        this.saveFavorites();
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }
}