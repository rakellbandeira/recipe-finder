class EdamamAPI {
    constructor() {
        this.APP_ID = 'fcffd402';
        this.APP_KEY = '4dfd9942135ff68fa4d1cddb07d67074'; 
        this.BASE_URL = 'https://api.edamam.com/api/recipes/v2';
    }

    async searchRecipes(searchQuery) {
        try {
            const queryString = Array.isArray(searchQuery) ? searchQuery.join(' ') : searchQuery;
            const params = new URLSearchParams({
            'type': 'public',
            'q': queryString,
            'app_id': this.APP_ID,
            'app_key': this.APP_KEY,
        });

            const url = `${this.BASE_URL}?${params.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Edamam-Account-User': 'user1'  
                }
            });

            if (!response.ok) {
                /* const errorData = await response.json();
                console.error('API Response:', errorData); */
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const actIngred = document.getElementById('activeIngred');
            
            actIngred.innerHTML = `Showing <span id="recipeCount">000</span> results for ${searchQuery}:`;
            let data = await response.json();
            console.log(`response.json showing: ${data}`);

            return await data;
            
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw error;
        }
    }
        
}

// To be able to track active ingredients
let activeIngredients = new Set();
/* let ingList = Array.from(activeIngredients).toString(); */


// Toggle ingredients as active/inactive
function markActive(divId) {
    const element = document.getElementById(divId);
    const ingredient = element.textContent;
    
    if (element.classList.contains('inactive')) {
        element.classList.remove('inactive');
        element.classList.add('active');
        activeIngredients.add(ingredient);
    } else {
        element.classList.remove('active');
        element.classList.add('inactive');
        activeIngredients.delete(ingredient);
    }

    // Search recipes whenever ingredients change
    searchRecipesWithCurrentIngredients();
}


// Search recipes with current ingredients
async function searchRecipesWithCurrentIngredients() {
    if (activeIngredients.size === 0) {
        // Clear recipes if no ingredients selected
        document.getElementById('recipes').innerHTML = '';
        return;
    }

    const api = new EdamamAPI();
    
    try {
        const results = await api.searchRecipes(Array.from(activeIngredients));
        displayRecipes(results.hits);
    } catch (error) {
        console.error('Error searching recipes:', error);
    }
}

// Display recipes in the UI
function displayRecipes(recipes) {
    const recipesContainer = document.getElementById('recipes');
    recipesContainer.innerHTML = "";

    recipes.forEach(recipe => {
        const recipeBox = createRecipeBox(recipe);
        recipesContainer.appendChild(recipeBox);
    });
}


// Create recipe box element
function createRecipeBox(recipeData) {
    const { recipe } = recipeData;
    
    const recipeLink = document.createElement('a');
    recipeLink.href = recipe.url;
    recipeLink.target = "_blank";

    recipeLink.innerHTML = `
        <div class="recipe-box">
            <picture>
                <img src="${recipe.image}" alt="${recipe.label}">
            </picture>
            <div class="recipe-box-info">
                <div class="recipe-box-info-title">
                    <h3>${recipe.label}</h3>
                    <h5 class="recipe-url">${recipe.source}</h5>
                </div>
                <div class="recipe-box-info-ingredients">
                    <h5>You have</h5>
                    <h5 class="amount-active-ingredients">${countMatchingIngredients(recipe.ingredientLines)}</h5>
                    <h5>ingredients</h5>
                </div>
            </div>
        </div>
    `;

    return recipeLink;
}

// Count how many ingredients the user has
function countMatchingIngredients(recipeIngredients) {
    let count = 0;
    activeIngredients.forEach(ingredient => {
        recipeIngredients.forEach(recipeIngredient => {
            if (recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())) {
                count++;
            }
        });
    });
    return count;
}

// Toggle collapsible sections
function toggleCollapsible() {
    const content = document.querySelector('.pantry-content');
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

// Toggle display between sections
function toggleDisplay(sectionId) {
    const sections = document.querySelectorAll('.activemenu');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}