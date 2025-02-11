class RestaurantCard {
    static create(restaurant) {
        const card = document.createElement('div');
        card.className = 'doseluru-card';
        card.setAttribute('data-aos', 'fade-up');
        
        const rating = RatingCalculator.calculateOverall(restaurant.ratings);
        const stars = RatingCalculator.generateStarRating(rating);
        
        card.innerHTML = `
            <div class="relative overflow-hidden">
                <img 
                    data-src="${restaurant.imagePath}" 
                    alt="${restaurant.name}" 
                    class="doseluru-card-image"
                    loading="lazy"
                >
                <div class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg">
                    <span class="font-bold text-sm">${restaurant.priceRange}</span>
                </div>
            </div>
            
            <div class="doseluru-card-content">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold">${restaurant.name}</h3>
                    <div class="flex items-center bg-${rating >= 4.0 ? 'green' : 'yellow'}-100 px-2 py-1 rounded">
                        <span class="font-bold mr-1">${RatingCalculator.formatRating(rating)}</span>
                        <span class="text-sm">/ 5</span>
                    </div>
                </div>
                
                <p class="text-gray-600 mb-2">${restaurant.area}</p>
                
                <div class="flex items-center mb-3">
                    ${stars.html}
                </div>
                
                <p class="text-sm text-gray-500 mb-4 line-clamp-2">${restaurant.description}</p>
                
                <div class="space-y-2 text-sm">
                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                        </svg>
                        <span><strong>Must Try:</strong> ${restaurant.mustTry}</span>
                    </div>
                    
                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>${restaurant.openHours}</span>
                    </div>
                    
                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span class="line-clamp-1">${restaurant.address}</span>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-gray-200">
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        ${Object.entries(restaurant.ratings).map(([key, value]) => `
                            <div class="flex items-center">
                                <span class="capitalize">${key}:</span>
                                <span class="ml-1 font-bold">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }
}