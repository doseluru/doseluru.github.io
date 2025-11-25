// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// DOM Elements
const loadingOverlay = document.getElementById('doseluru-loading-overlay');
const restaurantGrid = document.getElementById('doseluru-restaurant-grid');
const areaFilter = document.getElementById('area-filter');
const priceFilter = document.getElementById('price-filter');
const dietaryFilter = document.getElementById('dietary-filter');
const sortBy = document.getElementById('sort-by');
const resetFiltersBtn = document.getElementById('reset-filters');
const resultsCount = document.getElementById('results-count');
const mobileMenuButton = document.querySelector('.doseluru-mobile-menu-button');
const mobileMenu = document.querySelector('.doseluru-mobile-menu');

// Quick filter checkboxes
const filterHeritage = document.getElementById('filter-heritage');
const filterOpenNow = document.getElementById('filter-open-now');
const filterParking = document.getElementById('filter-parking');
const filterAC = document.getElementById('filter-ac');
const filterDelivery = document.getElementById('filter-delivery');
const filterQuick = document.getElementById('filter-quick');

// Nav city selectors
const navCitySelector = document.getElementById('nav-city-selector');
const mobileCitySelector = document.getElementById('mobile-city-selector');

// State management
let restaurants = [];
let areas = new Set();
let currentCity = '';
let cityData = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
areaFilter.addEventListener('change', handleFilters);
priceFilter.addEventListener('change', handleFilters);
dietaryFilter.addEventListener('change', handleFilters);
sortBy.addEventListener('change', handleFilters);
resetFiltersBtn.addEventListener('click', resetFilters);
mobileMenuButton.addEventListener('click', toggleMobileMenu);

// Quick filter event listeners
filterHeritage.addEventListener('change', handleFilters);
filterOpenNow.addEventListener('change', handleFilters);
filterParking.addEventListener('change', handleFilters);
filterAC.addEventListener('change', handleFilters);
filterDelivery.addEventListener('change', handleFilters);
filterQuick.addEventListener('change', handleFilters);

// Nav city selector event listeners
if (navCitySelector) {
    navCitySelector.addEventListener('change', (e) => handleCityChange(e.target.value));
}
if (mobileCitySelector) {
    mobileCitySelector.addEventListener('change', (e) => handleCityChange(e.target.value));
}

// Initialize application
async function initializeApp() {
    try {
        // Load all data
        const data = await RestaurantService.getAllData();
        cityData = data;

        // Get selected city from localStorage or use default
        currentCity = RestaurantService.getSelectedCity();

        // Set up city selector cards
        setupCityCards();

        // Load city data
        await loadCityData(currentCity);

        // Hide loading overlay
        loadingOverlay.style.display = 'none';
    } catch (error) {
        ErrorHandler.handle(error);
    }
}

// Setup city selector cards
function setupCityCards() {
    const cityCards = document.querySelectorAll('.doseluru-city-card');

    cityCards.forEach(card => {
        const cityId = card.dataset.city;

        // Highlight selected city
        if (cityId === currentCity) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }

        // Add click event
        card.addEventListener('click', () => handleCityChange(cityId));
    });

    // Sync nav dropdowns with current city
    syncCitySelectors(currentCity);
}

// Sync all city selectors
function syncCitySelectors(cityId) {
    // Update nav dropdown
    if (navCitySelector) {
        navCitySelector.value = cityId;
    }
    // Update mobile dropdown
    if (mobileCitySelector) {
        mobileCitySelector.value = cityId;
    }
    // Update city cards
    document.querySelectorAll('.doseluru-city-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.city === cityId) {
            card.classList.add('active');
        }
    });
}

// Handle city change
async function handleCityChange(cityId) {
    if (cityId === currentCity) return;

    // Sync all city selectors (cards + dropdowns)
    syncCitySelectors(cityId);

    // Save preference
    RestaurantService.setSelectedCity(cityId);
    currentCity = cityId;

    // Load new city data
    await loadCityData(cityId);

    // Scroll to top-rated section for better UX
    const topRatedSection = document.getElementById('top-rated');
    if (topRatedSection) {
        topRatedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Load city-specific data
async function loadCityData(cityId) {
    try {
        // Get city info
        const city = await RestaurantService.getCityInfo(cityId);

        if (!city) {
            throw new Error(`City ${cityId} not found`);
        }

        // Update city banner
        updateCityBanner(city);

        // Load restaurants for this city
        restaurants = await RestaurantService.getRestaurantsByCity(cityId);

        // Extract unique areas for this city
        areas = new Set();
        restaurants.forEach(restaurant => areas.add(restaurant.area));

        // Update area filter
        populateAreaFilter();

        // Reset filters
        resetFiltersQuiet();

        // Render restaurants
        renderRestaurants(restaurants);

    } catch (error) {
        console.error('Error loading city data:', error);
        ErrorHandler.handle(error);
    }
}

// Update city info banner
function updateCityBanner(city) {
    const bannerIcon = document.querySelector('.banner-icon');
    const cityName = document.getElementById('current-city-name');
    const cityDesc = document.getElementById('current-city-description');
    const cityFamous = document.getElementById('current-city-famous');

    if (bannerIcon) bannerIcon.textContent = city.emoji;
    if (cityName) cityName.textContent = `${city.displayName}, ${city.state}`;
    if (cityDesc) cityDesc.textContent = city.description;
    if (cityFamous) cityFamous.textContent = city.famousFor;
}

// Populate area filter dropdown
function populateAreaFilter() {
    // Clear existing options except "All Areas"
    while (areaFilter.options.length > 1) {
        areaFilter.remove(1);
    }

    // Add city-specific areas
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaFilter.appendChild(option);
    });
}

// Reset filters without triggering handleFilters (for city change)
function resetFiltersQuiet() {
    areaFilter.value = 'all';
    priceFilter.value = 'all';
    dietaryFilter.value = 'all';
    sortBy.value = 'rating';
    filterHeritage.checked = false;
    filterOpenNow.checked = false;
    filterParking.checked = false;
    filterAC.checked = false;
    filterDelivery.checked = false;
    filterQuick.checked = false;
}

// Handle filters and sorting
function handleFilters() {
    const selectedArea = areaFilter.value;
    const selectedPrice = priceFilter.value;
    const selectedDietary = dietaryFilter.value;
    const selectedSort = sortBy.value;

    let filteredRestaurants = [...restaurants];

    // Apply area filter
    if (selectedArea !== 'all') {
        filteredRestaurants = filteredRestaurants.filter(
            restaurant => restaurant.area === selectedArea
        );
    }

    // Apply price filter
    if (selectedPrice !== 'all') {
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            switch (selectedPrice) {
                case 'budget':
                    return restaurant.avgPrice < 100;
                case 'mid':
                    return restaurant.avgPrice >= 100 && restaurant.avgPrice <= 200;
                case 'premium':
                    return restaurant.avgPrice > 200;
                default:
                    return true;
            }
        });
    }

    // Apply dietary filter
    if (selectedDietary !== 'all') {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
            restaurant.dietary && restaurant.dietary.includes(selectedDietary)
        );
    }

    // Apply heritage filter
    if (filterHeritage.checked) {
        filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.heritage);
    }

    // Apply open now filter
    if (filterOpenNow.checked) {
        filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.isOpenNow);
    }

    // Apply parking filter
    if (filterParking.checked) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
            restaurant.amenities && restaurant.amenities.includes('parking')
        );
    }

    // Apply AC filter
    if (filterAC.checked) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
            restaurant.amenities && restaurant.amenities.includes('AC')
        );
    }

    // Apply delivery filter
    if (filterDelivery.checked) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
            restaurant.amenities && restaurant.amenities.includes('delivery')
        );
    }

    // Apply quick service filter
    if (filterQuick.checked) {
        filteredRestaurants = filteredRestaurants.filter(restaurant =>
            restaurant.amenities && restaurant.amenities.includes('quick-service')
        );
    }

    // Apply sorting
    filteredRestaurants.sort((a, b) => {
        switch (selectedSort) {
            case 'rating':
                return RatingCalculator.calculateOverall(b.ratings) -
                       RatingCalculator.calculateOverall(a.ratings);
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-low':
                return a.avgPrice - b.avgPrice;
            case 'price-high':
                return b.avgPrice - a.avgPrice;
            case 'wait-time':
                return parseWaitTime(a.waitTime) - parseWaitTime(b.waitTime);
            case 'reviews':
                return b.reviewCount - a.reviewCount;
            default:
                return 0;
        }
    });

    // Update results count
    updateResultsCount(filteredRestaurants.length);

    renderRestaurants(filteredRestaurants);
}

// Parse wait time string to minutes (for sorting)
function parseWaitTime(waitTime) {
    const match = waitTime.match(/(\d+)-(\d+)/);
    if (match) {
        return (parseInt(match[1]) + parseInt(match[2])) / 2;
    }
    return 0;
}

// Update results count display
function updateResultsCount(count) {
    const totalCount = restaurants.length;
    resultsCount.textContent = `Showing ${count} of ${totalCount} restaurants`;
}

// Reset all filters
function resetFilters() {
    // Reset dropdowns
    areaFilter.value = 'all';
    priceFilter.value = 'all';
    dietaryFilter.value = 'all';
    sortBy.value = 'rating';

    // Reset checkboxes
    filterHeritage.checked = false;
    filterOpenNow.checked = false;
    filterParking.checked = false;
    filterAC.checked = false;
    filterDelivery.checked = false;
    filterQuick.checked = false;

    // Re-render with all restaurants
    handleFilters();
}

// Render restaurants
function renderRestaurants(restaurantsToRender) {
    restaurantGrid.innerHTML = '';
    
    if (restaurantsToRender.length === 0) {
        restaurantGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-xl text-gray-600">No restaurants found matching your criteria.</p>
            </div>
        `;
        return;
    }
    
    restaurantsToRender.forEach(restaurant => {
        const card = RestaurantCard.create(restaurant);
        restaurantGrid.appendChild(card);
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', !isHidden);
    
    // Animate the menu button
    const icon = mobileMenuButton.querySelector('svg');
    icon.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
}

// Handle lazy loading of images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('.doseluru-card-image[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Initialize lazy loading
if ('IntersectionObserver' in window) {
    lazyLoadImages();
} else {
    // Fallback for older browsers
    document.querySelectorAll('.doseluru-card-image[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
}