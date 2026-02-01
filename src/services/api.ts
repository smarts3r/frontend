import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = "/api";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const refreshAccessToken = async () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    useAuthStore.setState({
        accessToken,
        refreshToken: newRefreshToken,
    });

    return accessToken;
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();
                onTokenRefreshed(newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export const getProducts = async () => {
    const response = await api.get("/products");
    return response.data;
};

export const getCategories = async () => {
    try {

        const response = await api.get("/categories");
        return response.data;
    } catch (error: unknown) {
        console.warn("Failed to fetch categories, returning empty list", error);
        return [];
    }
};

export default api;
