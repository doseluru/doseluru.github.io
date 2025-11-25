class RatingCalculator {
    static WEIGHTS = {
        taste: 0.25,
        ambience: 0.08,
        parking: 0.05,
        service: 0.12,
        value: 0.10,
        crispiness: 0.15,
        chutney: 0.15,
        sambar: 0.10
    };

    static calculateOverall(ratings) {
        let totalWeight = 0;
        let weightedSum = 0;

        Object.entries(ratings).forEach(([key, value]) => {
            const weight = this.WEIGHTS[key] || 0;
            weightedSum += value * weight;
            totalWeight += weight;
        });

        // Normalize to 5.0 scale if weights don't add to 1.0
        return totalWeight > 0 ? weightedSum / totalWeight * (totalWeight <= 1 ? 1/totalWeight : 1) : 0;
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