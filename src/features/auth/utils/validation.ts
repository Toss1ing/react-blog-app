import type { AuthFields, AuthMode } from '../types/auth.types';

export function validateAuth(fields: AuthFields, mode: AuthMode) {
    const isSignUp = mode === 'signup';

    return {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())
            ? ''
            : 'Enter a valid email address',

        password: fields.password.length >= 6
            ? ''
            : 'Password must be at least 6 characters long',

        confirmPassword: isSignUp && fields.password !== fields.confirmPassword
            ? 'Passwords do not match'
            : ''
    };
}