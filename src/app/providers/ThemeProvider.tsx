import {type ReactNode, useMemo, useState} from 'react';
import {createTheme, CssBaseline, ThemeProvider as MuiThemeProvider} from '@mui/material';
import {ThemeContext} from './ThemeContext';

const THEME_STORAGE_KEY = 'theme';
const LIGHT_THEME = 'light'
const DARK_THEME = 'dark';

export function ThemeProvider({children}: { children: ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>(() => {
        try {
            return localStorage.getItem(THEME_STORAGE_KEY) === DARK_THEME ? DARK_THEME : LIGHT_THEME;
        } catch {
            return 'light';
        }
    });
    const theme = useMemo(() => createTheme({palette: {mode}}), [mode]);

    function toggleTheme() {
        const next = mode === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
        setMode(next);
        localStorage.setItem(THEME_STORAGE_KEY, next);
    }

    return (
        <ThemeContext.Provider value={{mode, toggleTheme}}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline enableColorScheme/>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}
