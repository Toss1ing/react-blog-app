import { type ReactNode, useEffect, useRef, useState } from 'react';

import { useAuth } from './AuthContext';
import { FavoritesContext } from './FavoritesContext';
import {
    getFavorites,
    updateFavorites
} from '../../features/favorites/service/favorite.service.ts';

interface FavoritesProviderProps {
    children: ReactNode;
}

interface UserFavoritesProps extends FavoritesProviderProps {
    userId: string;
}

function UserFavorites({ userId, children }: UserFavoritesProps) {
    const [ids, setIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const isSaving = useRef(false);

    useEffect(() => {
        const controller = new AbortController();

        async function loadFavorites() {
            try {
                const favorites = await getFavorites(userId, controller.signal);

                if (!controller.signal.aborted) {
                    setIds(favorites);
                }
            } catch {
                if (!controller.signal.aborted) {
                    setError('Failed to load favorites');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadFavorites();

        return () => controller.abort();
    }, [userId]);

    async function toggle(id: string) {
        if (isSaving.current || isLoading) return;

        isSaving.current = true;
        setError('');

        const updatedIds = ids.includes(id)
            ? ids.filter(value => value !== id)
            : [...ids, id];

        try {
            await updateFavorites(userId, updatedIds);
            setIds(updatedIds);
        } catch {
            setError('Failed to update favorites');
        } finally {
            isSaving.current = false;
        }
    }

    return (
        <FavoritesContext.Provider value={{ ids, toggle, isLoading, error }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
    const { user } = useAuth();

    if (!user) {
        return (
            <FavoritesContext.Provider
                value={{
                    ids: [],
                    toggle: async () => {},
                    isLoading: false,
                    error: ''
                }}
            >
                {children}
            </FavoritesContext.Provider>
        );
    }

    return (
        <UserFavorites key={user.id} userId={user.id}>
            {children}
        </UserFavorites>
    );
}