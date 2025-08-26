// Debug utility for AuraFlow
// Toggle DEBUG_ENABLED to turn all logging on/off

const DEBUG_ENABLED = false; // Set to true to enable all debug logging

// Debug categories - can be toggled individually if needed
const DEBUG_CATEGORIES = {
    TIMER: true,
    AUDIO: true,
    CHAKRA: true,
    CANVAS: true,
    APP: true,
    PERFORMANCE: true
};

class DebugLogger {
    constructor() {
        this.enabled = DEBUG_ENABLED;
        this.categories = DEBUG_CATEGORIES;
    }
    
    // Main logging method
    log(category, message, data = null) {
        if (!this.enabled || !this.categories[category]) return;
        
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${category}]`;
        
        if (data !== null) {
            console.log(`${prefix} ${message}`, data);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }
    
    // Convenience methods for different categories
    timer(message, data = null) {
        this.log('TIMER', message, data);
    }
    
    audio(message, data = null) {
        this.log('AUDIO', message, data);
    }
    
    chakra(message, data = null) {
        this.log('CHAKRA', message, data);
    }
    
    canvas(message, data = null) {
        this.log('CANVAS', message, data);
    }
    
    app(message, data = null) {
        this.log('APP', message, data);
    }
    
    performance(message, data = null) {
        this.log('PERFORMANCE', message, data);
    }
    
    // Error logging (always enabled regardless of debug setting)
    error(category, message, error = null) {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}] [${category}] ERROR:`;
        
        if (error !== null) {
            console.error(`${prefix} ${message}`, error);
        } else {
            console.error(`${prefix} ${message}`);
        }
    }
    
    // Enable/disable debugging at runtime
    enable() {
        this.enabled = true;
        console.log('🐛 Debug logging enabled');
    }
    
    disable() {
        this.enabled = false;
        console.log('🐛 Debug logging disabled');
    }
    
    // Toggle specific category
    toggleCategory(category) {
        if (this.categories.hasOwnProperty(category)) {
            this.categories[category] = !this.categories[category];
            console.log(`🐛 Debug category ${category}: ${this.categories[category] ? 'enabled' : 'disabled'}`);
        }
    }
    
    // Get current status
    getStatus() {
        return {
            enabled: this.enabled,
            categories: { ...this.categories }
        };
    }
}

// Create singleton instance
const debug = new DebugLogger();

// Make it available globally for runtime debugging
if (typeof window !== 'undefined') {
    window.debugAura = debug;
}

export default debug;
