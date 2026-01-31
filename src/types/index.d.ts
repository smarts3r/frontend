import { Product, AuthResponse, User } from "./types";

export declare const productService: {
    getAll: () => Promise<Product[]>;
    getById: (id: number) => Promise<Product>;
    create: (product: Omit<Product, "id">) => Promise<Product>;
    update: (id: number, product: Partial<Product>) => Promise<Product>;
    delete: (id: number) => Promise<void>;
};
export declare const authService: {
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (userData: {
        name: string;
        email: string;
        password: string;
    }) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refresh: () => Promise<AuthResponse>;
    getCurrentUser: () => Promise<User>;
};
