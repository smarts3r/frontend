import axios from "axios";

const API_BASE_URL = "/api"; // Use proxy instead of direct URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      // Optional: Redirect to login only if not already there to avoid loops
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
    // Endpoint might vary, assuming /products/categories or similar
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.warn("Failed to fetch categories, returning empty list");
    return [];
  }
};

export default api;
