class EdamamAPI {
    constructor() {
        this.APP_ID = 'your_app_id';
        this.APP_KEY = 'your_app_key';
        this.BASE_URL = 'https://api.edamam.com/search';
    }

    async searchRecipes(query) {
        try {
            const response = await fetch(`${this.BASE_URL}?q=${query}&app_id=${this.APP_ID}&app_key=${this.APP_KEY}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }
}