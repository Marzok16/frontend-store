import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to attach JWT token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // Don't add token for login, signup, and public endpoints
        const publicPaths = ['/users/login/', '/users/signup/', '/payments/stripe-config/', '/users/verify-email/', '/users/resend-verification/', '/users/forgot-password/', '/users/reset-password/'];
        const isPublicPath = publicPaths.some(path => config.url?.includes(path));
        if (token && !isPublicPath) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Server Error:', {
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

export default instance;