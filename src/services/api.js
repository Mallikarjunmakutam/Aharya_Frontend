import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('aharya_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.access) {
          config.headers.Authorization = `Bearer ${user.access}`;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const userStr = localStorage.getItem('aharya_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.refresh) {
            const res = await axios.post(`${api.defaults.baseURL}/users/login/refresh/`, {
              refresh: user.refresh,
            });
            const newAccess = res.data.access;
            user.access = newAccess;
            localStorage.setItem('aharya_user', JSON.stringify(user));
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing token', refreshError);
        // If refresh fails, you might want to logout the user here.
        localStorage.removeItem('aharya_user');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
