// API Configuration utility
export const getApiBaseUrl = () => {
    // Priority order for API URL determination:
    // 1. Environment variable (highest priority)
    // 2. Current domain with API port (for production)
    // 3. Localhost (fallback for development)

    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }

    // In production, use the same domain as the frontend
    if (process.env.NODE_ENV === 'production') {
        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        return `${protocol}//${hostname}:4005`;
    }

    // Development fallback
    return 'http://localhost:4005';
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/v1/auth/login',
        SIGNUP: '/v1/auth/signup',
        RESET_PASSWORD: '/v1/auth/reset-password',
        VALIDATE_TOKEN: '/v1/auth/validate-token',
        COMPLETE_PROFILE: '/v1/auth/complete-profile',
        GOOGLE_SIGNUP: '/v1/auth/google/signup',
    },
    BLOG: {
        GET_BLOGS: '/v1/blog/get-blogs',
        GET_BLOG: '/v1/blog/get-blog',
        CREATE_BLOG: '/v1/blog/create-blog',
        LIKE: '/v1/blog',
        COMMENT: '/v1/blog',
    }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
    return `${getApiBaseUrl()}${endpoint}`;
};
