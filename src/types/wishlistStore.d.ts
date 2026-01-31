import type { Product, WishlistItem } from "@/types/";
interface WishlistStore {
    items: (WishlistItem & {
        product: Product;
    })[];
    addItem: (product: Product) => void;
    removeItem: (productId: number) => void;
    clearWishlist: () => void;
    isInWishlist: (productId: number) => boolean;
}
export declare const useWishlistStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<WishlistStore>, "setState" | "persist"> & {
    setState(partial: WishlistStore | Partial<WishlistStore> | ((state: WishlistStore) => WishlistStore | Partial<WishlistStore>), replace?: false | undefined): unknown;
    setState(state: WishlistStore | ((state: WishlistStore) => WishlistStore), replace: true): unknown;
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<WishlistStore, WishlistStore, unknown>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: WishlistStore) => void) => () => void;
        onFinishHydration: (fn: (state: WishlistStore) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<WishlistStore, WishlistStore, unknown>>;
    };
}>;
export {};
