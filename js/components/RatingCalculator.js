class RatingCalculator {
    static WEIGHTS = {
        taste: 0.4,
        ambience: 0.15,
        parking: 0.1,
        service: 0.2,
        value: 0.15
    };

    static calculateOverall(ratings) {
        return Object.entries(ratings).reduce((sum, [key, value]) => {
            return sum + (value * this.WEIGHTS[key]);
        }, 0);
    }

    static generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return {
            full: fullStars,
            half: hasHalfStar,
            empty: emptyStars,
            html: this.getStarHTML(fullStars, hasHalfStar, emptyStars)
        };
    }

    static getStarHTML(full, hasHalf, empty) {
        let html = '';
        
        // Add full stars
        for (let i = 0; i < full; i++) {
            html += '<span class="doseluru-star">★</span>';
        }
        
        // Add half star if needed
        if (hasHalf) {
            html += '<span class="doseluru-star-half">★</span>';
        }
        
        // Add empty stars
        for (let i = 0; i < empty; i++) {
            html += '<span class="doseluru-star-empty">☆</span>';
        }
        
        return html;
    }

    static formatRating(rating) {
        return Number(rating).toFixed(1);
    }

    static getRatingColor(rating) {
        if (rating >= 4.5) return '#4CAF50';  // Excellent
        if (rating >= 4.0) return '#8BC34A';  // Very Good
        if (rating >= 3.5) return '#FFC107';  // Good
        if (rating >= 3.0) return '#FF9800';  // Average
        return '#F44336';  // Below Average
    }
}