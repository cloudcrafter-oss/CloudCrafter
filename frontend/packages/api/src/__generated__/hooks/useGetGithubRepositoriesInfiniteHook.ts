// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetGithubRepositoriesQueryResponse, GetGithubRepositoriesPathParams } from "../types/GetGithubRepositories";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getGithubRepositoriesInfiniteQueryKey = (id: GetGithubRepositoriesPathParams["id"]) => [{ url: "/api/Providers/github/:id/repositories", params: { id: id } }] as const;

 export type GetGithubRepositoriesInfiniteQueryKey = ReturnType<typeof getGithubRepositoriesInfiniteQueryKey>;

 /**
 * {@link /api/Providers/github/:id/repositories}
 */
async function getGithubRepositoriesHook(id: GetGithubRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGithubRepositoriesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/github/${id}/repositories`, ...config });
    return res.data;
}

 export function getGithubRepositoriesInfiniteQueryOptionsHook(id: GetGithubRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getGithubRepositoriesInfiniteQueryKey(id);
    return infiniteQueryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getGithubRepositoriesHook(id, config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * {@link /api/Providers/github/:id/repositories}
 */
export function useGetGithubRepositoriesInfiniteHook<TData = InfiniteData<GetGithubRepositoriesQueryResponse>, TQueryData = GetGithubRepositoriesQueryResponse, TQueryKey extends QueryKey = GetGithubRepositoriesInfiniteQueryKey>(id: GetGithubRepositoriesPathParams["id"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetGithubRepositoriesQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGithubRepositoriesInfiniteQueryKey(id);
    const query = useInfiniteQuery({
        ...getGithubRepositoriesInfiniteQueryOptionsHook(id, config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}