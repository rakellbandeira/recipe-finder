class CategoryManager {
    constructor() {
        this.categories = [];
        this.loadCategories();
    }

    async loadCategories() {
        try {
            const response = await fetch('./data/categories.json'); // Changed from '../data/categories.json'
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.categories = data;
            this.renderCategories();
        } catch (error) {
            console.error('Error loading categories:', error);
            // Fallback categories if file can't be loaded
            this.categories = {
                "Pantry Essentials": ["butter", "egg", "garlic", "milk"],
                "Vegetables": ["carrot", "tomato", "onion"]
            };
            this.renderCategories();
        }
    }

    renderCategories() {
        const container = document.querySelector('.pantry-boxcontainer');
        container.innerHTML = '';

        Object.entries(this.categories).forEach(([category, items], index) => {
            const categoryHtml = `
                <div class="pantry-box">
                    <div class="pantry-title" onclick="toggleCollapsible('#cat${index}')">
                        <picture>
                            <img src="./assets/images/pantry/${category.toLowerCase()}.png">
                        </picture>
                        <div class="pantry-box-title">
                            <h2>${category}</h2>
                        </div>
                    </div>
                    <ul class="pantry-content" id="cat${index}">
                        ${items.map((item, i) => `
                            <li class="inactive" 
                                id="item${index}-${i}" 
                                onclick="markActive('item${index}-${i}')"
                            >${item}</li>
                        `).join('')}
                    </ul>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', categoryHtml);
        });
    }
}