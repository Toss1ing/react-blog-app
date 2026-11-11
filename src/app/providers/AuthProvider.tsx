import { type ReactNode, useState } from 'react';

import { getSession, signIn, signOut, signUp } from '../../features/auth/service/auth.service';
import { AuthContext } from './AuthContext';
import type { User } from '../../features/auth/types/auth.types';

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(getSession);

    async function login(email: string, password: string) {
        const user = await signIn(email, password);
        setUser(user);
    }

    async function register(email: string, password: string) {
        const user = await signUp(email, password);
        setUser(user);
    }

    function logout() {
        signOut();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}