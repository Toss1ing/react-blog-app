
import { useCallback, useEffect, useRef, useState } from 'react';

import { getPosts } from '../service/post.service';
import type { Post, PostSortField, SortDirection } from '../types/post.types';

const PAGE_SIZE = 6;
const LOAD_ERROR = 'Failed to load posts. Please try again.';

interface Options {
    search: string;
    sort: PostSortField | null;
    direction: SortDirection;
    ids?: string[];
}

export function usePosts({ search, sort, direction, ids }: Options) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const [revision, setRevision] = useState(0);

    const nextPage = useRef<number | null>(1);
    const controller = useRef<AbortController | null>(null);
    const busy = useRef(false);

    const idsKey = JSON.stringify(ids);

    const loadMore = useCallback(async () => {
        if (busy.current || nextPage.current === null) {
            return;
        }

        const page = nextPage.current;
        const request = new AbortController();

        controller.current = request;
        busy.current = true;

        setIsLoading(true);
        setError('');

        try {
            const result = await getPosts({
                page,
                pageSize: PAGE_SIZE,
                search,
                sort,
                direction,
                ids: idsKey ? JSON.parse(idsKey) as string[] : undefined,
                signal: request.signal
            });

            if (request.signal.aborted) return;

            setPosts(previous =>
                page === 1 ? result.data : [...previous, ...result.data]
            );

            nextPage.current = result.next;
            setHasMore(result.next !== null);
        } catch {
            if (!request.signal.aborted) {
                setError(LOAD_ERROR);
            }
        } finally {
            if (!request.signal.aborted) {
                busy.current = false;
                setIsLoading(false);
            }
        }
    }, [search, sort, direction, idsKey]);

    useEffect(() => {
        nextPage.current = 1;
        busy.current = false;

        setPosts([]);
        setHasMore(true);

        void loadMore();

        return () => controller.current?.abort();
    }, [loadMore, revision]);

    const refresh = useCallback(() => {
        setRevision(previous => previous + 1);
    }, []);

    return {
        posts,
        isLoading,
        error,
        hasMore,
        loadMore,
        refresh
    };
}
