// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// DOM Elements
const loadingOverlay = document.getElementById('doseluru-loading-overlay');
const restaurantGrid = document.getElementById('doseluru-restaurant-grid');
const areaFilter = document.getElementById('area-filter');
const sortBy = document.getElementById('sort-by');
const mobileMenuButton = document.querySelector('.doseluru-mobile-menu-button');
const mobileMenu = document.querySelector('.doseluru-mobile-menu');

// State management
let restaurants = [];
let areas = new Set();

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
areaFilter.addEventListener('change', handleFilters);
sortBy.addEventListener('change', handleFilters);
mobileMenuButton.addEventListener('click', toggleMobileMenu);

// Initialize application
async function initializeApp() {
    try {
        // Load restaurants data
        restaurants = await RestaurantService.getRestaurants();
        
        // Extract unique areas for filter
        restaurants.forEach(restaurant => areas.add(restaurant.area));
        populateAreaFilter();
        
        // Initial render
        renderRestaurants(restaurants);
        
        // Hide loading overlay
        loadingOverlay.style.display = 'none';
    } catch (error) {
        ErrorHandler.handle(error);
    }
}

// Populate area filter dropdown
function populateAreaFilter() {
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        areaFilter.appendChild(option);
    });
}

// Handle filters and sorting
function handleFilters() {
    const selectedArea = areaFilter.value;
    const selectedSort = sortBy.value;
    
    let filteredRestaurants = [...restaurants];
    
    // Apply area filter
    if (selectedArea !== 'all') {
        filteredRestaurants = filteredRestaurants.filter(
            restaurant => restaurant.area === selectedArea
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
            case 'price':
                return a.priceRange.length - b.priceRange.length;
            default:
                return 0;
        }
    });
    
    renderRestaurants(filteredRestaurants);
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