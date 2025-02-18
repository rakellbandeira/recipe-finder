class EdamamAPI {
    constructor() {
        this.APP_ID = 'fcffd402';
        this.APP_KEY = '4dfd9942135ff68fa4d1cddb07d67074'; 
        this.BASE_URL = 'https://api.edamam.com/api/recipes/v2';
    }

    // This gets the search query, insert it into the URL, fetches the data linked to that URL and returns it in JSON format
    async searchRecipes(searchQuery) {
        try {
            //This see if the search query is a single string or an array. In case of array, it joins them with space between making it a big string?
            const queryString = Array.isArray(searchQuery) ? searchQuery.join(' ') : searchQuery;
            console.log(queryString);
            
            //This gets the parameters to construct the URL, like q, appID and appKEY
            const params = new URLSearchParams({
            'type': 'public',
            'q': queryString,
            'app_id': this.APP_ID,
            'app_key': this.APP_KEY,
        });
            // Here we have the params turned to a string like: 'type=public&q=garlic&app_id=fcffd402&app_key=4dfd9942135ff68fa4d1cddb07d67074'
            //console.log(params.toString());
            
            //This adds the params turned to a string to the base URL like this: 'https://api.edamam.com/api/recipes/v2?type=public&q=garlic&app_id=fcffd402&app_key=4dfd9942135ff68fa4d1cddb07d67074'
            const url = `${this.BASE_URL}?${params.toString()}`;

            //console.log(url);
            
            
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

            const data = await response.json();
            const actIngred = document.getElementById('activeIngred');
            if (actIngred) {
                actIngred.innerHTML = `Showing <span id="recipeCount">0</span> results for ${searchQuery}:`;
            }            
            
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

    //THis checks if there is no ingredient selected and blanks the body
    if (activeIngredients.size === 0) {
        // Clear recipes if no ingredients selected
        document.getElementById('recipes').innerHTML = '';

        return;
    }

    const api = new EdamamAPI();
    
    //That stored an instance of API class and this is is going to get the function, pass the ingredient set (transformed to an array) to get the data in JSON
    try {
        const results = await api.searchRecipes(Array.from(activeIngredients));

        let countRecipes = results.hits.length;

        const recipeCount = document.getElementById('recipeCount');
        recipeCount.textContent = countRecipes;
        //console.log(`This is the length of the result: ${countRecipes}`);

    
        
        //This takes the JSON data and for each element, it creates a recipe card and appends it to the body.
        console.log(results.hits);
        
        displayRecipes(results.hits);
    } catch (error) {
        console.error('Error searching recipes:', error);
    }

}

// Gets
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
    
    const recipeLink = document.createElement('div');
    recipeLink.className = 'recipe-box-container'; 

    recipeLink.innerHTML = `
        <div class="recipe-box">
            <a href="${recipe.url}" target="_blank" class="recipe-link">
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
            </a>
                <button class="favorite-btn" onclick="toggleFavorite(event, this, '${recipe.url}')"> 
                       
                    <img src="./assets/images/hearts1.png" alt="favorite" width="24">
                </button>
            
        </div>
    `;

    return recipeLink;
}

function isFavorite(recipe) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some(f => f.url === recipe.url);
}

function toggleFavorite(event, button, recipeUrl) {
    event.preventDefault();
    event.stopPropagation();
    
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const recipeBox = button.closest('.recipe-box');
    const recipeData = {
        url: recipeUrl,
        image: recipeBox.querySelector('picture img').src,
        label: recipeBox.querySelector('h3').textContent,
        source: recipeBox.querySelector('.recipe-url').textContent,
        ingredientLines: [] // You might want to store this too
    };
    
    const index = favorites.findIndex(f => f.url === recipeUrl);
    
    if (index === -1) {
        // Add to favorites
        favorites.push(recipeData);
        button.querySelector('img').src = './assets/images/hearts1.png';
    } else {
        // Remove from favorites
        favorites.splice(index, 1);
        button.querySelector('img').src = './assets/images/hearts2.png';
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
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
function toggleCollapsible(number) {
    const content = document.querySelector(number);
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
}

// Toggle display between sections
function toggleDisplay(sectionId) {
    const sections = document.querySelectorAll('.activemenu');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}