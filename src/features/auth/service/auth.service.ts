import type { User, UserAccount } from '../types/auth.types';
import { API_BASE_URL } from '../../../shared/config/api.config.ts';

const USERS_URL = `${API_BASE_URL}/users`;
const SESSION_KEY = 'blog.session';

async function getUserByEmail(email: string): Promise<UserAccount | undefined> {
    const normalizedEmail = email.trim().toLowerCase();

    const response = await fetch(
        `${USERS_URL}?email=${encodeURIComponent(normalizedEmail)}`
    );

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    const users: UserAccount[] = await response.json();

    return users.find(user => user.email.toLowerCase() === normalizedEmail);
}

function saveSession(account: UserAccount): User {
    const user: User = {
        id: account.id,
        email: account.email,
        favorites: account.favorites ?? []
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));

    return user;
}

export async function signIn(email: string, password: string): Promise<User> {
    const account = await getUserByEmail(email);

    if (!account || account.password !== password) {
        throw new Error('Invalid email or password');
    }

    return saveSession(account);
}

export async function signUp(email: string, password: string): Promise<User> {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        throw new Error('Email is already registered');
    }

    const response = await fetch(USERS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
            favorites: []
        })
    });

    if (!response.ok) {
        throw new Error('Failed to register user');
    }

    const account: UserAccount = await response.json();

    return saveSession(account);
}

export function getSession(): User | null {
    try {
        const session = localStorage.getItem(SESSION_KEY);

        return session ? JSON.parse(session) as User : null;
    } catch {
        return null;
    }
}

export function signOut() {
    localStorage.removeItem(SESSION_KEY);
}