export interface PostStatistics {
    views: number;
    likes: number;
    dislikes: number;
}

export interface Post {
    id: string;
    title: string;
    text: string;
    statistics: PostStatistics;
}

export type PostSortField = 'views' | 'likes';

export type SortDirection = 'asc' | 'desc';

export interface PaginatedPosts {
    first: number | null;
    prev: number | null;
    next: number | null;
    last: number | null;
    pages: number;
    items: number;
    data: Post[];
}