import { useRef, useState, type SubmitEvent } from 'react';
import {
    Alert,
    Button,
    Card,
    CardContent,
    IconButton,
    TextField,
    Typography
} from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useAuth } from '../../../app/providers/AuthContext';
import { useFavorites } from '../../../app/providers/FavoritesContext';
import { deletePost, updatePost } from '../service/post.service';
import { validatePost } from '../utils/validation';
import type { Post } from '../types/post.types';

import './PostCard.css';

interface PostCardProps {
    post: Post;
    onChange: () => void;
}

export function PostCard({ post, onChange }: PostCardProps) {
    const { user } = useAuth();
    const { ids, toggle, isLoading } = useFavorites();

    const [editing, setEditing] = useState(false);
    const [title, setTitle] = useState(post.title);
    const [text, setText] = useState(post.text);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const pending = useRef(false);

    const isFavorite = ids.includes(post.id);
    const errors = validatePost(title, text);
    const isValid = !errors.title && !errors.text;

    function startEditing() {
        setTitle(post.title);
        setText(post.text);
        setError('');
        setEditing(true);
    }

    function cancelEditing() {
        setEditing(false);
        setError('');
    }

    async function handleAction(action: 'save' | 'delete') {
        if (!user || pending.current) return;
        if (action === 'save' && !isValid) return;

        pending.current = true;
        setBusy(true);
        setError('');

        try {
            if (action === 'save') {
                await updatePost(post.id, {
                    title: title.trim(),
                    text: text.trim()
                });

                setEditing(false);
            } else {
                await deletePost(post.id);
            }

            onChange();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to update post'
            );
        } finally {
            pending.current = false;
            setBusy(false);
        }
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        void handleAction('save');
    }

    async function handleFavorite() {
        setError('');

        try {
            await toggle(post.id);
        } catch {
            setError('Failed to update favorites');
        }
    }

    return (
        <Card component="article" variant="outlined">
            <CardContent>
                {user && editing ? (
                    <form className="post-card-form" onSubmit={handleSubmit}>
                        <TextField
                            label="Title"
                            name="title"
                            required
                            fullWidth
                            value={title}
                            disabled={busy}
                            error={Boolean(errors.title)}
                            helperText={errors.title}
                            onChange={event => setTitle(event.target.value)}
                        />

                        <TextField
                            label="Post content"
                            name="text"
                            required
                            fullWidth
                            multiline
                            minRows={4}
                            value={text}
                            disabled={busy}
                            error={Boolean(errors.text)}
                            helperText={errors.text}
                            onChange={event => setText(event.target.value)}
                        />

                        <div className="post-card-actions">
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={busy || !isValid}
                            >
                                {busy ? 'Saving...' : 'Save'}
                            </Button>

                            <Button disabled={busy} onClick={cancelEditing}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <>
                        <Typography component="h2" variant="h6" gutterBottom>
                            {post.title}
                        </Typography>

                        <Typography className="post-card-text">
                            {post.text}
                        </Typography>
                    </>
                )}

                <div className="post-card-statistics">
                    <Typography variant="body2" color="text.secondary">
                        Views: {post.statistics.views}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Likes: {post.statistics.likes}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Dislikes : {post.statistics.dislikes}
                    </Typography>
                </div>

                {user && (
                    <div className="post-card-actions">
                        <IconButton
                            color={isFavorite ? 'error' : 'default'}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            aria-pressed={isFavorite}
                            disabled={busy || isLoading}
                            onClick={() => void handleFavorite()}
                        >
                            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>

                        {!editing && (
                            <Button disabled={busy} onClick={startEditing}>
                                Edit
                            </Button>
                        )}

                        <Button
                            color="error"
                            disabled={busy}
                            onClick={() => void handleAction('delete')}
                        >
                            Delete
                        </Button>
                    </div>
                )}

                {error && (
                    <Alert severity="error" className="post-card-error">
                        {error}
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}