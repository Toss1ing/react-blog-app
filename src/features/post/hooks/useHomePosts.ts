import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';

import { usePosts } from './usePosts';
import type { PostSortField } from '../types/post.types';

export function useHomePosts() {
    const [params, setParams] = useSearchParams();
    const sentinelRef = useRef<HTMLDivElement>(null);

    const search = params.get('search') ?? '';
    const sortValue = params.get('sort');

    const sort = sortValue === 'views' || sortValue === 'likes'
        ? sortValue
        : null;

    const direction = params.get('direction') === 'asc' ? 'asc' : 'desc';

    const {
        posts,
        isLoading,
        error,
        hasMore,
        loadMore,
        refresh
    } = usePosts({ search, sort, direction });

    useEffect(() => {
        const target = sentinelRef.current;

        if (!target || isLoading || error || !hasMore) {
            return;
        }

        const observer = new IntersectionObserver(entries => {
            if (entries[0]?.isIntersecting) {
                void loadMore();
            }
        }, {
            rootMargin: '200px'
        });

        observer.observe(target);

        return () => observer.disconnect();
    }, [isLoading, error, hasMore, loadMore]);

    function changeSearch(value: string) {
        setParams(previous => {
            const next = new URLSearchParams(previous);

            if (value) {
                next.set('search', value);
            } else {
                next.delete('search');
            }

            return next;
        }, { replace: true });
    }

    function changeSort(field: PostSortField) {
        setParams(previous => {
            const next = new URLSearchParams(previous);

            next.set('sort', field);
            next.set(
                'direction',
                sort === field && direction === 'desc' ? 'asc' : 'desc'
            );

            return next;
        });
    }

    function resetSort() {
        setParams(previous => {
            const next = new URLSearchParams(previous);

            next.delete('sort');
            next.delete('direction');

            return next;
        });
    }

    return {
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
    };
}