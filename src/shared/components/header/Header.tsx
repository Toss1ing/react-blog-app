import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router';

import { useAuth } from '../../../app/providers/AuthContext';
import { useThemeMode } from '../../../app/providers/ThemeContext';

import './Header.css';

export function Header() {
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useThemeMode();

    return (
        <AppBar position="static" color="default" elevation={1}>
            <Container maxWidth="md">
                <Toolbar disableGutters className="header-toolbar">
                    <Button component={Link} to="/" color="inherit">
                        Blog posts
                    </Button>

                    <div className="header-actions">
                        <Button onClick={toggleTheme}>
                            {mode === 'light' ? 'Dark theme' : 'Light theme'}
                        </Button>

                        {user ? (
                            <>
                                <Button component={Link} to="/favorites">
                                    Favorites
                                </Button>

                                <Button component={Link} to="/about-me">
                                    About me
                                </Button>

                                <Typography variant="body2">
                                    {user.email}
                                </Typography>

                                <Button onClick={logout}>
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <Button component={Link} to="/login">
                                Log in
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    );
}