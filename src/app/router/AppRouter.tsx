import {lazy, type ReactNode, Suspense} from 'react';
import {Navigate, Route, Routes} from 'react-router';

import {useAuth} from '../providers/AuthContext';
import {Loader} from '../../shared/components/loader/Loader.tsx';

const HomePage = lazy(
    () => import('../../pages/homePage/HomePage'),
);

const LoginPage = lazy(() => import('../../pages/loginPage/LoginPage'));

const AboutMePage = lazy(() => import('../../pages/aboutMePage/AboutMePage'));

const AddPostPage = lazy(() => import('../../pages/addPostPage/AddPostPage'));

const FavoritesPage = lazy(() => import('../../pages/favoritesPage/FavoritesPage'));

function Protected({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
}

export function AppRouter() {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route path="/addpost" element={<Protected><AddPostPage /></Protected>} />
                <Route path="/favorites" element={<Protected><FavoritesPage /></Protected>} />
                <Route path="/about-me" element={<Protected><AboutMePage /></Protected>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage key="home" />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}