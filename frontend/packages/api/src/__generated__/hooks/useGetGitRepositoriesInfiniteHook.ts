// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetGitRepositoriesQueryResponse, GetGitRepositoriesPathParams } from "../types/GetGitRepositories";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getGitRepositoriesInfiniteQueryKey = (id: GetGitRepositoriesPathParams["id"]) => [{ url: "/api/Providers/:id/repositories", params: { id: id } }] as const;

 export type GetGitRepositoriesInfiniteQueryKey = ReturnType<typeof getGitRepositoriesInfiniteQueryKey>;

 /**
 * {@link /api/Providers/:id/repositories}
 */
async function getGitRepositoriesHook(id: GetGitRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGitRepositoriesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/${id}/repositories`, ...config });
    return res.data;
}

 export function getGitRepositoriesInfiniteQueryOptionsHook(id: GetGitRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getGitRepositoriesInfiniteQueryKey(id);
    return infiniteQueryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getGitRepositoriesHook(id, config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * {@link /api/Providers/:id/repositories}
 */
export function useGetGitRepositoriesInfiniteHook<TData = InfiniteData<GetGitRepositoriesQueryResponse>, TQueryData = GetGitRepositoriesQueryResponse, TQueryKey extends QueryKey = GetGitRepositoriesInfiniteQueryKey>(id: GetGitRepositoriesPathParams["id"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetGitRepositoriesQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGitRepositoriesInfiniteQueryKey(id);
    const query = useInfiniteQuery({
        ...getGitRepositoriesInfiniteQueryOptionsHook(id, config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}