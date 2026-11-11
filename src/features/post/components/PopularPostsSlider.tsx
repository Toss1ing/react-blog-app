import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    CardContent,
    Typography
} from '@mui/material';

import { getPosts } from '../service/post.service';
import type { Post } from '../types/post.types';
import { Loader } from '../../../shared/components/loader/Loader';

import './PopularPostsSlider.css';

const POPULAR_POSTS_LIMIT = 3;

export function PopularPostsSlider() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadPosts() {
            try {
                const result = await getPosts({
                    page: 1,
                    pageSize: POPULAR_POSTS_LIMIT,
                    sort: 'views',
                    direction: 'desc',
                    signal: controller.signal
                });

                if (controller.signal.aborted) return;

                setPosts(result.data);
                setIndex(0);
            } catch {
                if (!controller.signal.aborted) {
                    setError('Failed to load popular posts.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        void loadPosts();

        return () => controller.abort();
    }, [attempt]);

    function moveSlide(direction: number) {
        setIndex(previous =>
            (previous + direction + posts.length) % posts.length
        );
    }

    function handleRetry() {
        setError('');
        setIsLoading(true);
        setAttempt(previous => previous + 1);
    }

    const currentPost = posts[index];

    return (
        <section
            className="popular-posts"
            aria-label="Popular posts"
            aria-roledescription="carousel"
        >
            <Typography component="h2" variant="h5" gutterBottom>
                Most popular posts
            </Typography>

            {isLoading && <Loader />}

            {!isLoading && error && (
                <Alert
                    severity="error"
                    action={
                        <Button color="inherit" onClick={handleRetry}>
                            Retry
                        </Button>
                    }
                >
                    {error}
                </Alert>
            )}

            {!isLoading && !error && !currentPost && (
                <Typography role="status">
                    No posts available.
                </Typography>
            )}

            {!isLoading && !error && currentPost && (
                <>
                    <div aria-live="polite" aria-atomic="true">
                        <Card
                            component="article"
                            variant="outlined"
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} of ${posts.length}`}
                        >
                            <CardContent>
                                <Typography component="h3" variant="h6" gutterBottom>
                                    {currentPost.title}
                                </Typography>

                                <Typography className="popular-posts-text">
                                    {currentPost.text}
                                </Typography>

                                <div className="popular-posts-statistics">
                                    <Typography variant="body2" color="text.secondary">
                                        Views: {currentPost.statistics.views}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Likes: {currentPost.statistics.likes}
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="popular-posts-controls">
                        <Button
                            variant="outlined"
                            aria-label="Previous post"
                            onClick={() => moveSlide(-1)}
                        >
                            ←
                        </Button>

                        <Typography>
                            {index + 1} / {posts.length}
                        </Typography>

                        <Button
                            variant="outlined"
                            aria-label="Next post"
                            onClick={() => moveSlide(1)}
                        >
                            →
                        </Button>
                    </div>
                </>
            )}
        </section>
    );
}