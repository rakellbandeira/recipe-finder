class EdamamAPI {
    constructor() {
        this.APP_ID = 'fcffd402';
        this.APP_KEY = '4dfd9942135ff68fa4d1cddb07d67074'; 
        this.BASE_URL = 'https://api.edamam.com/api/recipes/v2';
    }

    async searchRecipes(query) {
        try {
            const params = new URLSearchParams({
                'type': 'public',
                'q': query,
                'app_id': this.APP_ID,
                'app_key': this.APP_KEY,
                'random': true  // Optional, to get varied results
            });

            const url = `${this.BASE_URL}?${params.toString()}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Edamam-Account-User': 'user1'  // Required as per error message
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Response:', errorData);
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw error;
        }
    }

    // Add method to search by health labels (dietary restrictions)
    async searchByDiet(query, healthLabels = []) {
        try {
            const params = new URLSearchParams({
                'type': 'public',
                'q': query,
                'app_id': this.APP_ID,
                'app_key': this.APP_KEY
            });

            // Add health labels if provided
            healthLabels.forEach(label => {
                params.append('health', label);
            });

            const url = `${this.BASE_URL}?${params.toString()}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching recipes:', error);
            throw error;
        }
    }
}