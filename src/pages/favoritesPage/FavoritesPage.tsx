import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router';
import {Alert, Button, Container, Typography} from '@mui/material';

import {useFavorites} from '../../app/providers/FavoritesContext.ts';
import {getPosts} from '../../features/post/service/post.service';
import {PostCard} from '../../features/post/components/PostCard';
import type {PaginatedPosts} from '../../features/post/types/post.types';
import {Loader} from '../../shared/components/loader/Loader';

import './FavoritesPage.css';

const PAGE_SIZE = 6;
const EMPTY_MESSAGE = 'No favorite posts yet. Add some from the home page.';

interface FavoritePostsProps {
    ids: string[];
    page: number;
    reload: number;
    onRefresh: () => void;
}

function FavoritePosts({ids, page, reload, onRefresh}: FavoritePostsProps) {
    const [posts, setPosts] = useState<PaginatedPosts | null>(null);
    const [error, setError] = useState('');
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
        const controller = new AbortController();

        async function loadPosts() {
            setPosts(null);
            setError('');

            try {
                const response = await getPosts({
                    page,
                    pageSize: PAGE_SIZE,
                    ids,
                    signal: controller.signal
                });

                if (controller.signal.aborted) return;

                const lastPage = Math.max(1, response.pages);

                if (page > lastPage) {
                    setSearchParams(previous => {
                        const params = new URLSearchParams(previous);
                        params.set('page', String(lastPage));
                        return params;
                    }, {replace: true});

                    return;
                }

                setPosts(response);
            } catch {
                if (!controller.signal.aborted) {
                    setError('Failed to load favorites. Please try again.');
                }
            }
        }

        void loadPosts();

        return () => controller.abort();
    }, [ids, page, reload, setSearchParams]);

    function changePage(nextPage: number) {
        if (!posts || nextPage < 1 || nextPage > posts.pages || nextPage === page) {
            return;
        }

        setSearchParams(previous => {
            const params = new URLSearchParams(previous);
            params.set('page', String(nextPage));
            return params;
        });
    }

    if (error) {
        return (
            <Alert
                severity="error"
                action={
                    <Button color="inherit" onClick={onRefresh}>
                        Retry
                    </Button>
                }
            >
                {error}
            </Alert>
        );
    }

    if (!posts) {
        return <Loader/>;
    }

    if (posts.data.length === 0) {
        return <Typography role="status">{EMPTY_MESSAGE}</Typography>;
    }

    return (
        <>
            <div className="favorites-posts">
                {posts.data.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onChange={onRefresh}
                    />
                ))}
            </div>

            <nav className="favorites-pagination" aria-label="Favorites pagination">
                <Button
                    aria-label="Previous page"
                    disabled={page === 1}
                    onClick={() => changePage(page - 1)}
                >
                    ←
                </Button>

                {Array.from({length: posts.pages}, (_, index) => index + 1).map(number => (
                    <Button
                        key={number}
                        className="favorites-page-button"
                        variant={number === page ? 'contained' : 'outlined'}
                        aria-current={number === page ? 'page' : undefined}
                        aria-label={`Page ${number}`}
                        onClick={() => changePage(number)}
                    >
                        {number}
                    </Button>
                ))}

                <Button
                    aria-label="Next page"
                    disabled={page === posts.pages}
                    onClick={() => changePage(page + 1)}
                >
                    →
                </Button>
            </nav>
        </>
    );
}

export default function FavoritesPage() {
    const { ids, isLoading, error } = useFavorites();

    const [searchParams] = useSearchParams();
    const [reload, setReload] = useState(0);

    const pageValue = Number(searchParams.get('page') ?? 1);
    const page = Number.isSafeInteger(pageValue) && pageValue > 0
        ? pageValue
        : 1;

    function refreshPosts() {
        setReload(previous => previous + 1);
    }

    return (
        <Container component="main" maxWidth="md" className="favorites-page">
            <div className="favorites-header">
                <Typography component="h1" variant="h4">
                    Favorites
                </Typography>
            </div>

            {error && (
                <Alert severity="error">
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <Loader />
            ) : ids.length === 0 ? (
                !error && (
                    <Typography role="status">
                        {EMPTY_MESSAGE}
                    </Typography>
                )
            ) : (
                <FavoritePosts
                    ids={ids}
                    page={page}
                    reload={reload}
                    onRefresh={refreshPosts}
                />
            )}
        </Container>
    );
}