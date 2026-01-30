import type { CartItem, Product } from "@/types/";
interface CartStore {
    items: (CartItem & {
        product: Product;
    })[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}
export declare const useCartStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<CartStore>, "setState" | "persist"> & {
    setState(partial: CartStore | Partial<CartStore> | ((state: CartStore) => CartStore | Partial<CartStore>), replace?: false | undefined): unknown;
    setState(state: CartStore | ((state: CartStore) => CartStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<CartStore, CartStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: CartStore) => void) => () => void;
        onFinishHydration: (fn: (state: CartStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<CartStore, CartStore, unknown>>;
    };
}>;
export {};
