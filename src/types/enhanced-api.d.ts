import type { Product } from "@/types/";
export declare class ApiError extends Error {
    status: number;
    code?: string | undefined;
    constructor(message: string, status: number, code?: string | undefined);
}
export declare function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T>;
export declare function useApi<T, P = void>(fetcher: (params?: P) => Promise<T>, options?: {
    immediate?: boolean;
    retryCount?: number;
    retryDelay?: number;
}): {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
    execute: (params?: P, retries?: number) => Promise<T | null>;
    retry: () => Promise<T | null>;
    reset: () => void;
};
export declare const api: {
    getProducts: () => Promise<Product[]>;
    getProduct: (id: string | number) => Promise<Product>;
    createProduct: (product: any) => Promise<unknown>;
    updateProduct: (id: string | number, product: any) => Promise<unknown>;
    deleteProduct: (id: string | number) => Promise<unknown>;
    getCart: () => Promise<unknown>;
    addToCart: (productId: string | number, quantity: number) => Promise<unknown>;
    updateCartItem: (itemId: string | number, quantity: number) => Promise<unknown>;
    removeFromCart: (itemId: string | number) => Promise<unknown>;
    getWishlist: () => Promise<unknown>;
    addToWishlist: (productId: string | number) => Promise<unknown>;
    removeFromWishlist: (itemId: string | number) => Promise<unknown>;
    getOrders: () => Promise<unknown>;
    getOrder: (id: string | number) => Promise<unknown>;
    createOrder: (orderData: any) => Promise<unknown>;
    login: (credentials: {
        email: string;
        password: string;
    }) => Promise<unknown>;
    register: (userData: any) => Promise<unknown>;
    getProfile: () => Promise<unknown>;
    updateProfile: (profileData: any) => Promise<unknown>;
    getAdminStats: () => Promise<unknown>;
    getAdminUsers: () => Promise<unknown>;
    getAdminOrders: () => Promise<unknown>;
};
