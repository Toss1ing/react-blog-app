import { CircularProgress } from '@mui/material';

import './Loader.css';

interface LoaderProps {
    fullScreen?: boolean;
}

export function Loader({ fullScreen = false }: LoaderProps) {
    return (
        <div
            className={`loader ${fullScreen ? 'loader-fullscreen' : ''}`}
            role="status"
            aria-label="Loading"
        >
            <CircularProgress />
        </div>
    );
}