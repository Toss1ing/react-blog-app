import { API_BASE_URL } from '../../../shared/config/api.config';

import type {
    PaginatedPosts,
    PostSortField,
    SortDirection
} from '../types/post.types';

const POSTS_URL = `${API_BASE_URL}/posts`;

interface PostValues {
    title: string;
    text: string;
}

interface GetPostsParams {
    page: number;
    pageSize: number;
    search?: string;
    sort?: PostSortField | null;
    direction?: SortDirection;
    signal?: AbortSignal;
    ids?: string[];
}

export async function getPosts({
                                   page,
                                   pageSize,
                                   search,
                                   sort,
                                   direction = 'desc',
                                   signal,
                                   ids
                               }: GetPostsParams): Promise<PaginatedPosts> {
    const url = new URL(POSTS_URL);

    url.searchParams.set('_page', String(page));
    url.searchParams.set('_per_page', String(pageSize));

    if (sort) {
        const sortField = `statistics.${sort}`;

        url.searchParams.set(
            '_sort',
            direction === 'desc' ? `-${sortField}` : sortField
        );
    }

    const where: Record<string, unknown> = {};

    if (ids) {
        where.id = { in: ids };
    }

    if (search?.trim()) {
        const query = search.trim();

        where.or = [
            { title: { contains: query } },
            { text: { contains: query } }
        ];
    }

    if (Object.keys(where).length > 0) {
        url.searchParams.set('_where', JSON.stringify(where));
    }

    const response = await fetch(url, { signal });

    if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    return await response.json() as Promise<PaginatedPosts>;
}

export async function createPost(values: PostValues) {
    const response = await fetch(POSTS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...values,
            statistics: {
                views: 0,
                likes: 0,
                dislikes: 0
            }
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create post. Please try again.');
    }

    return response.json();
}

export async function updatePost(id: string, values: PostValues) {
    const response = await fetch(
        `${POSTS_URL}/${encodeURIComponent(id)}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }
    );

    if (!response.ok) {
        throw new Error('Failed to update post');
    }

    return response.json();
}

export async function deletePost(id: string) {
    const response = await fetch(
        `${POSTS_URL}/${encodeURIComponent(id)}`,
        {
            method: 'DELETE'
        }
    );

    if (!response.ok) {
        throw new Error('Failed to delete post');
    }
}