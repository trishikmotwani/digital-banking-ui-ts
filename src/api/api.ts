import axios, { 
  type InternalAxiosRequestConfig, 
  type AxiosResponse, 
  type AxiosError 
} from 'axios';

/**
 * Configure Axios client for Spring Boot API integration.
 * Automatically injects JWT and handles session expiry globally.
 */
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Securely inject JWT into every outgoing request
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // TypeScript requires checking for headers existence before assignment
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle HTTP 401/403 for automatic logout
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Check if the server returned an authentication error
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear session data to protect user privacy
      localStorage.clear(); 
      // Force redirect to login page
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
