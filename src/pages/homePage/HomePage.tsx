import { Link } from 'react-router';
import {
    Alert,
    Button,
    Container,
    TextField,
    Typography
} from '@mui/material';

import { useAuth } from '../../app/providers/AuthContext';
import { PostCard } from '../../features/post/components/PostCard';
import { useHomePosts } from '../../features/post/hooks/useHomePosts';
import { Loader } from '../../shared/components/loader/Loader';

import './HomePage.css';

export default function HomePage() {
    const { user } = useAuth();

    const {
        posts,
        search,
        sort,
        direction,
        isLoading,
        error,
        sentinelRef,
        loadMore,
        refresh,
        changeSearch,
        changeSort,
        resetSort
    } = useHomePosts();

    return (
        <Container component="main" maxWidth="md" className="home-page">
            <div className="home-header">

                {user && (
                    <Button
                        component={Link}
                        to="/addpost"
                        variant="contained"
                    >
                        Add post
                    </Button>
                )}
            </div>

            <TextField
                fullWidth
                label="Search posts"
                value={search}
                onChange={event => changeSearch(event.target.value)}
            />

            <div className="home-sort">
                <Button
                    variant={sort === 'views' ? 'contained' : 'outlined'}
                    aria-pressed={sort === 'views'}
                    onClick={() => changeSort('views')}
                >
                    Views {sort === 'views' && (direction === 'asc' ? '↑' : '↓')}
                </Button>

                <Button
                    variant={sort === 'likes' ? 'contained' : 'outlined'}
                    aria-pressed={sort === 'likes'}
                    onClick={() => changeSort('likes')}
                >
                    Likes {sort === 'likes' && (direction === 'asc' ? '↑' : '↓')}
                </Button>

                {sort && (
                    <Button onClick={resetSort}>
                        Reset
                    </Button>
                )}
            </div>

            <div className="home-posts">
                {posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onChange={refresh}
                    />
                ))}
            </div>

            {error && (
                <Alert
                    severity="error"
                    className="home-error"
                    action={
                        <Button color="inherit" onClick={() => void loadMore()}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {isLoading && <Loader />}

            {!isLoading && !error && posts.length === 0 && (
                <Typography role="status">
                    No posts found.
                </Typography>
            )}

            <div ref={sentinelRef} className="home-sentinel" aria-hidden="true" />
        </Container>
    );
}