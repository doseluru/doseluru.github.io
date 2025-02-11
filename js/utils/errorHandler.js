class ErrorHandler {
    static ERROR_MESSAGES = {
        NETWORK: 'Unable to connect to the server. Please check your internet connection.',
        DATA: 'There was an error loading the restaurant data.',
        UNKNOWN: 'An unexpected error occurred. Please try again later.'
    };

    static handle(error) {
        console.error('Error:', error);
        
        let message = this.ERROR_MESSAGES.UNKNOWN;
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
            message = this.ERROR_MESSAGES.NETWORK;
        } else if (error.message.includes('data structure')) {
            message = this.ERROR_MESSAGES.DATA;
        }
        
        this.showErrorUI(message);
        
        // Hide loading overlay if it's still visible
        const loadingOverlay = document.getElementById('doseluru-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    static showErrorUI(message) {
        const grid = document.getElementById('doseluru-restaurant-grid');
        if (!grid) return;

        grid.innerHTML = `
            <div class="col-span-full">
                <div class="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-red-700">${message}</p>
                        </div>
                    </div>
                    <div class="mt-4">
                        <button 
                            onclick="location.reload()"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}