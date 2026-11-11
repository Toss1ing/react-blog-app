import { type FormEvent, useState } from 'react';
import { Navigate } from 'react-router';
import {
    Alert,
    Button,
    Container,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';

import { useAuth } from '../../app/providers/AuthContext';
import type { AuthFields, AuthMode } from '../../features/auth/types/auth.types';
import { validateAuth } from '../../features/auth/utils/validation';

import './LoginPage.css';

const initialFields: AuthFields = {
    email: '',
    password: '',
    confirmPassword: ''
};

export default function LoginPage() {
    const { user, login, register } = useAuth();

    const [mode, setMode] = useState<AuthMode>('signin');
    const [fields, setFields] = useState<AuthFields>(initialFields);
    const [touched, setTouched] = useState<Partial<Record<keyof AuthFields, boolean>>>({});
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSignUp = mode === 'signup';
    const errors = validateAuth(fields, mode);
    const isValid = Object.values(errors).every(error => !error);

    function handleModeChange(newMode: AuthMode) {
        setMode(newMode);
        setFields(initialFields);
        setTouched({});
        setError('');
    }

    function updateField(field: keyof AuthFields, value: string) {
        setFields(previous => ({
            ...previous,
            [field]: value
        }));

        setError('');
    }

    function touchField(field: keyof AuthFields) {
        setTouched(previous => ({
            ...previous,
            [field]: true
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);
        setError('');

        try {
            if (isSignUp) {
                await register(fields.email, fields.password);
            } else {
                await login(fields.email, fields.password);
            }
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return (
        <Container component="main" maxWidth="sm" className="login-page">
            <Paper variant="outlined" className="login-card">
                <Typography component="h1" variant="h4" className="login-title">
                    {isSignUp ? 'Sign up' : 'Sign in'}
                </Typography>

                <Tabs
                    value={mode}
                    variant="fullWidth"
                    aria-label="Authentication"
                    className="login-tabs"
                    onChange={(_, value: AuthMode) => handleModeChange(value)}
                >
                    <Tab value="signin" label="Sign in" disabled={isSubmitting} />
                    <Tab value="signup" label="Sign up" disabled={isSubmitting} />
                </Tabs>

                <form
                    className="login-form"
                    noValidate
                    onSubmit={handleSubmit}
                    aria-busy={isSubmitting}
                >
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        fullWidth
                        value={fields.email}
                        disabled={isSubmitting}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email ? errors.email : ' '}
                        onBlur={() => touchField('email')}
                        onChange={event => updateField('email', event.target.value)}
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                        required
                        fullWidth
                        value={fields.password}
                        disabled={isSubmitting}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password ? errors.password : ' '}
                        onBlur={() => touchField('password')}
                        onChange={event => updateField('password', event.target.value)}
                    />

                    {isSignUp && (
                        <TextField
                            label="Confirm password"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            fullWidth
                            value={fields.confirmPassword}
                            disabled={isSubmitting}
                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                            helperText={touched.confirmPassword ? errors.confirmPassword : ' '}
                            onBlur={() => touchField('confirmPassword')}
                            onChange={event => updateField('confirmPassword', event.target.value)}
                        />
                    )}

                    {error && <Alert severity="error">{error}</Alert>}

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting ? 'Please wait...' : isSignUp ? 'Sign up' : 'Sign in'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}