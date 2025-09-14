import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await api.post('/auth/token');
                if (res.status === 200) {
                    Cookies.set('accessToken', res.data.accessToken, { expires: 1 / 24 });
                    api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.accessToken;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token failed, redirecting to login...");
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
