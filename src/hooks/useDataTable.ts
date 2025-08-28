// options passed to the fetch function
export interface UseDataTableOptions {
    pageIndex: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, string>;
}

// options passed to the hook
export interface UseDataTableHookProps<TData> {
    fetchFn: (params: UseDataTableOptions) => Promise<{ data: TData[]; total: number }>;
    queryKey: string[];
    initialState?: Partial<UseDataTableOptions>;
}

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SortingState } from '@tanstack/react-table';

export function useDataTable<TData>({
    fetchFn,
    queryKey,
    initialState = {}
}: UseDataTableHookProps<TData>) {
    const [pageIndex, setPageIndex] = useState(initialState.pageIndex ?? 0);
    const [pageSize, setPageSize] = useState(initialState.pageSize ?? 10);
    const [sortBy, setSortBy] = useState(initialState.sortBy ?? 'id');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialState.sortOrder ?? 'desc');
    const [search, setSearch] = useState(initialState.search ?? '');
    const [filters, setFilters] = useState<Record<string, string>>(initialState.filters ?? {});
    const [sorting, setSorting] = useState<SortingState>([]);

    const setFilter = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const { data, isLoading, error } = useQuery({
        queryKey: [...queryKey, { pageIndex, pageSize, sortBy, sortOrder, search, filters }],
        queryFn: () =>
            fetchFn({ pageIndex, pageSize, sortBy, sortOrder, search, filters }),
        // keepPreviousData: true,
    });

    return {
        data: data?.data ?? [],
        total: data?.total ?? 0,
        isLoading,
        error,
        pageIndex,
        pageSize,
        setPageIndex,
        setPageSize,
        sorting,
        setSorting,
        sortBy,
        sortOrder,
        setSortBy,
        setSortOrder,
        search,
        setSearch,
        filters,
        setFilter,
    };
}





// import { useQuery } from "@tanstack/react-query";

// export function useDataTable<TData>(
//     getDataMethod: () => Promise<TData[]>,
//     queryKey: string
// ) {
//     return useQuery({
//         queryKey: [queryKey],
//         queryFn: getDataMethod,
//         staleTime: 5 * 60 * 1000, // 5 minutes
//         gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
//         refetchOnWindowFocus: false,
//         retry: 3,
//     });
// }