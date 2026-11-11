import { API_BASE_URL } from '../../../shared/config/api.config';
import type { User } from '../../auth/types/auth.types';

const USERS_URL = `${API_BASE_URL}/users`;

export async function getFavorites(
    userId: string,
    signal?: AbortSignal
): Promise<string[]> {
    const response = await fetch(`${USERS_URL}/${userId}`, { signal });

    if (!response.ok) {
        throw new Error('Failed to load favorites');
    }

    const user: User = await response.json();

    return user.favorites ?? [];
}

export async function updateFavorites(
    userId: string,
    favorites: string[]
): Promise<void> {
    const response = await fetch(`${USERS_URL}/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ favorites })
    });

    if (!response.ok) {
        throw new Error('Failed to update favorites');
    }
}