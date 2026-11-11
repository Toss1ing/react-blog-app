export const MAX_TITLE_LENGTH = 100;

export function validatePost(title: string, text: string) {
    return {
        title: !title.trim()
            ? 'Title is required'
            : Array.from(title).length > MAX_TITLE_LENGTH
                ? `Title must not exceed ${MAX_TITLE_LENGTH} characters`
                : '',

        text: !text.trim()
            ? 'Post content is required'
            : ''
    };
}