import { Container, Paper, Typography } from '@mui/material';

import { PopularPostsSlider } from '../../features/post/components/PopularPostsSlider';
import { useAuth } from '../../app/providers/AuthContext';

import './AboutMePage.css';

export default function AboutMePage() {

    const { user } = useAuth();

    return (
        <Container component="main" maxWidth="md" className="about-page">
            <Paper variant="outlined" className="about-card">
                <Typography component="h1" variant="h4" gutterBottom>
                    About me
                </Typography>

                <Typography>
                    Email: {user?.email}
                </Typography>
            </Paper>

            <PopularPostsSlider />
        </Container>
    );
}