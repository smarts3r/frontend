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


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
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
