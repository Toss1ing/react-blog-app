import { Link } from 'react-router';
import {
    Alert,
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from '@mui/material';

import { useAddPostForm } from '../../features/post/hooks/useAddPostForm';

import './AddPostPage.css';

export default function AddPostPage() {
    const {
        title,
        text,
        errors,
        error,
        isValid,
        isSubmitting,
        titleLength,
        maxTitleLength,
        titleError,
        textError,
        updateField,
        touchField,
        handleSubmit
    } = useAddPostForm();

    return (
        <Container component="main" maxWidth="md" className="add-post-page">
            <Paper variant="outlined" className="add-post-card">
                <Typography component="h1" variant="h4" className="add-post-title">
                    Create post
                </Typography>

                <form
                    className="add-post-form"
                    noValidate
                    onSubmit={handleSubmit}
                    aria-busy={isSubmitting}
                >
                    <TextField
                        label="Title"
                        name="title"
                        required
                        fullWidth
                        value={title}
                        disabled={isSubmitting}
                        error={titleError}
                        helperText={titleError ? errors.title : `${titleLength}/${maxTitleLength} characters`}
                        onBlur={() => touchField('title')}
                        onChange={event => updateField('title', event.target.value)}
                    />

                    <TextField
                        label="Post content"
                        name="text"
                        required
                        fullWidth
                        multiline
                        minRows={6}
                        value={text}
                        disabled={isSubmitting}
                        error={textError}
                        helperText={textError ? errors.text : ' '}
                        onBlur={() => touchField('text')}
                        onChange={event => updateField('text', event.target.value)}
                    />

                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <div className="add-post-actions">
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Create post'}
                        </Button>

                        <Button
                            component={Link}
                            to="/"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Paper>
        </Container>
    );
}