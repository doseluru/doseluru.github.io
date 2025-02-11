const DoseluruConfig = {
    // API Configuration
    API: {
        BASE_URL: 'data/',
        ENDPOINTS: {
            RESTAURANTS: 'restaurants.json'
        },
        CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
    },

    // Rating Weights
    RATINGS: {
        WEIGHTS: {
            taste: 0.4,
            ambience: 0.15,
            parking: 0.1,
            service: 0.2,
            value: 0.15
        },
        THRESHOLDS: {
            EXCELLENT: 4.5,
            VERY_GOOD: 4.0,
            GOOD: 3.5,
            AVERAGE: 3.0
        }
    },

    // UI Configuration
    UI: {
        ANIMATION_DURATION: 800,
        LAZY_LOADING: {
            ENABLED: true,
            THRESHOLD: 0.1
        },
        GRID: {
            MIN_CARD_WIDTH: 300,
            GAP: 32
        }
    },

    // Feature Flags
    FEATURES: {
        ENABLE_CACHE: true,
        ENABLE_OFFLINE_MODE: false,
        ENABLE_ANALYTICS: false
    }
};