import { createContext, useContext } from 'react';

interface FavoritesContextValue {
    ids: string[];
    toggle: (id: string) => Promise<void>;
    isLoading: boolean;
    error: string;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites() {
    const context = useContext(FavoritesContext);

    if (!context) {
        throw new Error('FavoritesProvider is missing');
    }

    return context;
}