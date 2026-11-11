import { createContext, useContext } from 'react';
import type { User } from '../../features/auth/types/auth.types';

interface AuthContextValue {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('AuthProvider is missing');
    }

    return context;
}