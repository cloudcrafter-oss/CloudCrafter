// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetGitBranchesQueryResponse, GetGitBranchesPathParams } from "../types/GetGitBranches";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getGitBranchesQueryKey = (id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"]) => [{ url: "/api/Providers/:id/branches/:repositoryId", params: { id: id, repositoryId: repositoryId } }] as const;

 export type GetGitBranchesQueryKey = ReturnType<typeof getGitBranchesQueryKey>;

 /**
 * {@link /api/Providers/:id/branches/:repositoryId}
 */
async function getGitBranchesHook(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGitBranchesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/${id}/branches/${repositoryId}`, ...config });
    return res.data;
}

 export function getGitBranchesQueryOptionsHook(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], config: Partial<RequestConfig> = {}) {
    const queryKey = getGitBranchesQueryKey(id, repositoryId);
    return queryOptions({
        enabled: !!(id && repositoryId),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getGitBranchesHook(id, repositoryId, config);
        },
    });
}

 /**
 * {@link /api/Providers/:id/branches/:repositoryId}
 */
export function useGetGitBranchesHook<TData = GetGitBranchesQueryResponse, TQueryData = GetGitBranchesQueryResponse, TQueryKey extends QueryKey = GetGitBranchesQueryKey>(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], options: {
    query?: Partial<QueryObserverOptions<GetGitBranchesQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGitBranchesQueryKey(id, repositoryId);
    const query = useQuery({
        ...getGitBranchesQueryOptionsHook(id, repositoryId, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}