import {BrowserRouter} from 'react-router';
import {AppRouter} from './router/AppRouter';
import {ThemeProvider} from './providers/ThemeProvider';
import {AuthProvider} from './providers/AuthProvider';
import {FavoritesProvider} from './providers/FavoritesProvider';
import {Header} from '../shared/components/header/Header.tsx';

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <FavoritesProvider>
                    <BrowserRouter>
                        <Header/>
                        <AppRouter/>
                    </BrowserRouter>
                </FavoritesProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
