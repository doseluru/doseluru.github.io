class RestaurantService {
    static API_BASE_URL = 'data/';
    static CACHE_KEY = 'doseluru_data_cache';
    static CITY_PREF_KEY = 'doseluru_selected_city';
    static CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
    static cityData = null;

    static async getAllData() {
        try {
            // Check cache first
            const cachedData = this.getFromCache();
            if (cachedData) {
                this.cityData = cachedData;
                return cachedData;
            }

            const response = await fetch(`${this.API_BASE_URL}restaurants.json`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Validate data structure
            if (!data.cities || typeof data.cities !== 'object') {
                throw new Error('Invalid data structure');
            }

            // Cache the results
            this.setCache(data);
            this.cityData = data;

            return data;
        } catch (error) {
            console.error('Error fetching restaurant data:', error);
            throw error;
        }
    }

    static async getRestaurantsByCity(cityId) {
        const data = await this.getAllData();
        const city = data.cities[cityId];

        if (!city) {
            throw new Error(`City ${cityId} not found`);
        }

        return city.restaurants || [];
    }

    static async getCityInfo(cityId) {
        const data = await this.getAllData();
        return data.cities[cityId] || null;
    }

    static async getAllCities() {
        const data = await this.getAllData();
        return data.cities;
    }

    static getDefaultCity() {
        const data = this.cityData;
        return data?.defaultCity || 'bengaluru';
    }

    static getSelectedCity() {
        return localStorage.getItem(this.CITY_PREF_KEY) || this.getDefaultCity();
    }

    static setSelectedCity(cityId) {
        localStorage.setItem(this.CITY_PREF_KEY, cityId);
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

    static async getRestaurantById(id, cityId) {
        const restaurants = await this.getRestaurantsByCity(cityId);
        return restaurants.find(restaurant => restaurant.id === id);
    }

    static async getRestaurantsByArea(area, cityId) {
        const restaurants = await this.getRestaurantsByCity(cityId);
        return restaurants.filter(restaurant => restaurant.area === area);
    }
}