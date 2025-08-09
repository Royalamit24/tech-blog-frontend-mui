// Environment Configuration Management
class EnvironmentConfig {
    constructor() {
        this.env = process.env.NODE_ENV || 'development';
        this.config = this.loadConfig();
    }

    loadConfig() {
        const baseConfig = {
            development: {
                apiUrl: 'http://localhost:4005',
                debug: true,
                logLevel: 'debug'
            },
            production: {
                apiUrl: this.getProductionApiUrl(),
                debug: false,
                logLevel: 'error'
            },
            staging: {
                apiUrl: process.env.REACT_APP_API_URL || 'http://staging-api.example.com:4005',
                debug: true,
                logLevel: 'warn'
            }
        };

        return baseConfig[this.env] || baseConfig.development;
    }

    getProductionApiUrl() {
        // Priority order:
        // 1. Explicit environment variable
        // 2. Auto-detect from current domain
        // 3. Fallback to localhost (should not happen in production)
        
        if (process.env.REACT_APP_API_URL) {
            return process.env.REACT_APP_API_URL;
        }

        if (typeof window !== 'undefined') {
            const { protocol, hostname } = window.location;
            return `${protocol}//${hostname}:4005`;
        }

        console.warn('Unable to determine API URL in production environment');
        return 'http://localhost:4005';
    }

    get apiUrl() {
        return this.config.apiUrl;
    }

    get isProduction() {
        return this.env === 'production';
    }

    get isDevelopment() {
        return this.env === 'development';
    }

    get debug() {
        return this.config.debug;
    }
}

// Export singleton instance
export default new EnvironmentConfig();
