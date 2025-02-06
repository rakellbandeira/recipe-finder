class OpenFoodFactsAPI {
    constructor() {
        this.BASE_URL = 'https://world.openfoodfacts.org/api/v0';
    }

    async getIngredientInfo(ingredient) {
        try {
            const url = `${this.BASE_URL}/search?search_terms=${ingredient}&search_simple=1&json=1`;
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching ingredient info:', error);
            throw error;
        }
    }
}