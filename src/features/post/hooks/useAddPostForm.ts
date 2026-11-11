import { useRef, useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router';

import { useAuth } from '../../../app/providers/AuthContext';
import { createPost } from '../service/post.service';
import { validatePost, MAX_TITLE_LENGTH } from '../utils/validation';

export function useAddPostForm() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [touched, setTouched] = useState({
        title: false,
        text: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const pending = useRef(false);

    const errors = validatePost(title, text);
    const isValid = !errors.title && !errors.text;
    const titleLength = Array.from(title).length;

    const titleError = Boolean(errors.title && (touched.title || title.length > 0));
    const textError = Boolean(errors.text && touched.text);

    function updateField(field: 'title' | 'text', value: string) {
        if (field === 'title') {
            setTitle(value);
        } else {
            setText(value);
        }

        setError('');
    }

    function touchField(field: 'title' | 'text') {
        setTouched(previous => ({
            ...previous,
            [field]: true
        }));
    }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        setTouched({ title: true, text: true });

        if (!user || !isValid || pending.current) return;

        pending.current = true;
        setIsSubmitting(true);
        setError('');

        try {
            await createPost({
                title: title.trim(),
                text: text.trim()
            });

            navigate('/', { replace: true });
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to create post'
            );
        } finally {
            pending.current = false;
            setIsSubmitting(false);
        }
    }

    return {
        title,
        text,
        errors,
        error,
        isValid,
        isSubmitting,
        titleLength,
        maxTitleLength: MAX_TITLE_LENGTH,
        titleError,
        textError,
        updateField,
        touchField,
        handleSubmit
    };
}