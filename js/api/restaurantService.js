class RestaurantService {
    static API_BASE_URL = 'data/';
    static CACHE_KEY = 'doseluru_restaurants_cache';
    static CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

    static async getRestaurants() {
        try {
            // Check cache first
            const cachedData = this.getFromCache();
            if (cachedData) {
                return cachedData;
            }

            const response = await fetch(`${this.API_BASE_URL}restaurants.json`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Validate data structure
            if (!Array.isArray(data.restaurants)) {
                throw new Error('Invalid data structure');
            }
            
            // Cache the results
            this.setCache(data.restaurants);
            
            return data.restaurants;
        } catch (error) {
            console.error('Error fetching restaurants:', error);
            throw error;
        }
    }

    static getFromCache() {
        const cached = localStorage.getItem(this.CACHE_KEY);
        if (!cached) return null;

        const { timestamp, data } = JSON.parse(cached);
        const now = new Date().getTime();

        if (now - timestamp > this.CACHE_DURATION) {
            localStorage.removeItem(this.CACHE_KEY);
            return null;
        }

        return data;
    }

    static setCache(data) {
        const cacheData = {
            timestamp: new Date().getTime(),
            data
        };
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    }

    static async getRestaurantById(id) {
        const restaurants = await this.getRestaurants();
        return restaurants.find(restaurant => restaurant.id === id);
    }

    static async getRestaurantsByArea(area) {
        const restaurants = await this.getRestaurants();
        return restaurants.filter(restaurant => restaurant.area === area);
    }
}