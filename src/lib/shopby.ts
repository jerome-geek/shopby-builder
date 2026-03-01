// Mocking ShopBy API calls
export const ShopByApi = {
    async getProducts() {
        // Return dummy products for MVP testing
        return [
            {
                id: 'prod-1',
                name: 'Cool T-Shirt',
                price: 29000,
                imageUrl: 'https://via.placeholder.com/150',
            },
            {
                id: 'prod-2',
                name: 'Nice Pants',
                price: 45000,
                imageUrl: 'https://via.placeholder.com/150',
            },
            {
                id: 'prod-3',
                name: 'Awesome Hat',
                price: 15000,
                imageUrl: 'https://via.placeholder.com/150',
            },
        ];
    },
    async getCategories() {
        // Return dummy categories
        return [
            { id: 'cat-1', name: 'Outer' },
            { id: 'cat-2', name: 'Top' },
            { id: 'cat-3', name: 'Bottom' },
        ];
    },
};
