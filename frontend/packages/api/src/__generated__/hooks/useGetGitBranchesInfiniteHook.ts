// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetGitBranchesQueryResponse, GetGitBranchesPathParams } from "../types/GetGitBranches";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getGitBranchesInfiniteQueryKey = (id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"]) => [{ url: "/api/Providers/:id/branches/:repositoryId", params: { id: id, repositoryId: repositoryId } }] as const;

 export type GetGitBranchesInfiniteQueryKey = ReturnType<typeof getGitBranchesInfiniteQueryKey>;

 /**
 * {@link /api/Providers/:id/branches/:repositoryId}
 */
async function getGitBranchesHook(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGitBranchesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/${id}/branches/${repositoryId}`, ...config });
    return res.data;
}

 export function getGitBranchesInfiniteQueryOptionsHook(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], config: Partial<RequestConfig> = {}) {
    const queryKey = getGitBranchesInfiniteQueryKey(id, repositoryId);
    return infiniteQueryOptions({
        enabled: !!(id && repositoryId),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getGitBranchesHook(id, repositoryId, config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * {@link /api/Providers/:id/branches/:repositoryId}
 */
export function useGetGitBranchesInfiniteHook<TData = InfiniteData<GetGitBranchesQueryResponse>, TQueryData = GetGitBranchesQueryResponse, TQueryKey extends QueryKey = GetGitBranchesInfiniteQueryKey>(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetGitBranchesQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGitBranchesInfiniteQueryKey(id, repositoryId);
    const query = useInfiniteQuery({
        ...getGitBranchesInfiniteQueryOptionsHook(id, repositoryId, config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}