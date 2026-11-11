export interface User {
    id: string;
    email: string;
    favorites: string[];
}

export interface UserAccount extends User {
    password: string;
}

export interface AuthFields {
    email: string;
    password: string;
    confirmPassword: string;
}

export type AuthMode = 'signin' | 'signup';