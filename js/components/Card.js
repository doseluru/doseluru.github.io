class RestaurantCard {
    static create(restaurant) {
        const card = document.createElement('div');
        card.className = 'doseluru-card';
        card.setAttribute('data-aos', 'fade-up');

        const rating = RatingCalculator.calculateOverall(restaurant.ratings);
        const stars = RatingCalculator.generateStarRating(rating);

        // Generate badges HTML
        const badgesHTML = this.generateBadges(restaurant);

        // Generate amenities HTML
        const amenitiesHTML = this.generateAmenities(restaurant);

        // Generate dietary options HTML
        const dietaryHTML = this.generateDietaryOptions(restaurant);

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
                ${restaurant.isOpenNow ? '<div class="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">OPEN NOW</div>' : ''}
                ${restaurant.heritage ? '<div class="absolute top-16 left-4 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold">🏛️ HERITAGE</div>' : ''}
            </div>

            <div class="doseluru-card-content">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <h3 class="text-xl font-bold">${restaurant.name}</h3>
                        ${restaurant.heritage ? `<p class="text-xs text-amber-700">Since ${restaurant.established}</p>` : ''}
                    </div>
                    <div class="flex items-center bg-${rating >= 4.0 ? 'green' : 'yellow'}-100 px-2 py-1 rounded">
                        <span class="font-bold mr-1">${RatingCalculator.formatRating(rating)}</span>
                        <span class="text-sm">/ 5</span>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <p class="text-gray-600">${restaurant.area}</p>
                    <p class="text-sm text-gray-500">${restaurant.reviewCount} reviews</p>
                </div>

                <div class="flex items-center mb-3">
                    ${stars.html}
                </div>

                <p class="text-sm text-gray-500 mb-4 line-clamp-2">${restaurant.description}</p>

                ${badgesHTML}

                <div class="space-y-2 text-sm mt-3">
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
                        <svg class="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span class="line-clamp-1">${restaurant.address}</span>
                    </div>

                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span><strong>Avg Price:</strong> ₹${restaurant.avgPrice} per person</span>
                    </div>

                    <div class="flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        <span><strong>Wait Time:</strong> ${restaurant.waitTime}</span>
                    </div>
                </div>

                ${dietaryHTML}
                ${amenitiesHTML}

                <div class="mt-4 pt-4 border-t border-gray-200">
                    <h4 class="font-semibold text-sm mb-2">Rating Breakdown</h4>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        ${Object.entries(restaurant.ratings).map(([key, value]) => {
                            const isDosaSpecific = ['crispiness', 'chutney', 'sambar'].includes(key);
                            return `
                                <div class="flex items-center justify-between ${isDosaSpecific ? 'bg-yellow-50 px-2 py-1 rounded' : ''}">
                                    <span class="capitalize ${isDosaSpecific ? 'font-semibold' : ''}">${key}:</span>
                                    <span class="ml-1 font-bold">${value}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    static generateBadges(restaurant) {
        const badges = [];

        if (restaurant.heritage) {
            badges.push(`<span class="doseluru-badge doseluru-badge-heritage">Est. ${restaurant.established}</span>`);
        }

        if (restaurant.isOpenNow) {
            badges.push(`<span class="doseluru-badge doseluru-badge-open">Open Now</span>`);
        }

        if (badges.length === 0) return '';

        return `<div class="flex flex-wrap gap-2 mb-3">${badges.join('')}</div>`;
    }

    static generateAmenities(restaurant) {
        if (!restaurant.amenities || restaurant.amenities.length === 0) return '';

        const amenityIcons = {
            'parking': '🅿️',
            'AC': '❄️',
            'delivery': '🚚',
            'valet': '🚗',
            'quick-service': '⚡',
            'modern': '✨',
            'family-friendly': '👨‍👩‍👧‍👦',
            'chain': '🔗',
            'budget': '💰',
            'filter-coffee': '☕',
            'street-food': '🍴',
            'no-frills': '🎯'
        };

        const amenitiesHTML = restaurant.amenities.map(amenity => {
            const icon = amenityIcons[amenity] || '✓';
            return `<span class="doseluru-amenity-badge">${icon} ${amenity.replace('-', ' ')}</span>`;
        }).join('');

        return `
            <div class="mt-3">
                <h4 class="font-semibold text-xs mb-2">Amenities</h4>
                <div class="flex flex-wrap gap-1">
                    ${amenitiesHTML}
                </div>
            </div>
        `;
    }

    static generateDietaryOptions(restaurant) {
        if (!restaurant.dietary || restaurant.dietary.length === 0) return '';

        const dietaryIcons = {
            'vegetarian': '🥬',
            'vegan-options': '🌱',
            'jain': '🙏',
            'non-veg': '🍖'
        };

        const dietaryHTML = restaurant.dietary.map(option => {
            const icon = dietaryIcons[option] || '✓';
            return `<span class="doseluru-dietary-badge">${icon} ${option.replace('-', ' ')}</span>`;
        }).join('');

        return `
            <div class="mt-3">
                <h4 class="font-semibold text-xs mb-2">Dietary Options</h4>
                <div class="flex flex-wrap gap-1">
                    ${dietaryHTML}
                </div>
            </div>
        `;
    }
}