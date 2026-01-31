interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}
export declare function LoadingSpinner({ size, text, className, }: LoadingSpinnerProps): import("react/jsx-runtime").JSX.Element;
interface ErrorDisplayProps {
    error: string | Error;
    onRetry?: () => void;
    title?: string;
}
export declare function ErrorDisplay({ error, onRetry, title, }: ErrorDisplayProps): import("react/jsx-runtime").JSX.Element;
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}
export declare function EmptyState({ icon, title, description, action, }: EmptyStateProps): import("react/jsx-runtime").JSX.Element;
export declare const fadeIn: {
    initial: {
        opacity: number;
    };
    animate: {
        opacity: number;
    };
    exit: {
        opacity: number;
    };
    transition: {
        duration: number;
    };
};
export declare const slideUp: {
    initial: {
        opacity: number;
        transform: string;
    };
    animate: {
        opacity: number;
        transform: string;
    };
    exit: {
        opacity: number;
        transform: string;
    };
    transition: {
        duration: number;
    };
};
export declare const scaleIn: {
    initial: {
        opacity: number;
        transform: string;
    };
    animate: {
        opacity: number;
        transform: string;
    };
    exit: {
        opacity: number;
        transform: string;
    };
    transition: {
        duration: number;
    };
};
export declare function useApiCall<T>(): {
    data: T | null;
    loading: boolean;
    error: string | null;
    execute: (apiCall: () => Promise<T>) => Promise<T | null>;
    reset: () => void;
};
export {};
