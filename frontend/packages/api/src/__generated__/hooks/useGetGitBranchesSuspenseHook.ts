// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetGitBranchesQueryResponse, GetGitBranchesPathParams } from "../types/GetGitBranches";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getGitBranchesSuspenseQueryKey = (id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"]) => [{ url: "/api/Providers/:id/branches/:repositoryId", params: { id: id, repositoryId: repositoryId } }] as const;

 export type GetGitBranchesSuspenseQueryKey = ReturnType<typeof getGitBranchesSuspenseQueryKey>;

 /**
 * {@link /api/Providers/:id/branches/:repositoryId}
 */
async function getGitBranchesHook(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGitBranchesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/${id}/branches/${repositoryId}`, ...config });
    return res.data;
}

 export function getGitBranchesSuspenseQueryOptionsHook(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], config: Partial<RequestConfig> = {}) {
    const queryKey = getGitBranchesSuspenseQueryKey(id, repositoryId);
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
export function useGetGitBranchesSuspenseHook<TData = GetGitBranchesQueryResponse, TQueryData = GetGitBranchesQueryResponse, TQueryKey extends QueryKey = GetGitBranchesSuspenseQueryKey>(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetGitBranchesQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGitBranchesSuspenseQueryKey(id, repositoryId);
    const query = useSuspenseQuery({
        ...getGitBranchesSuspenseQueryOptionsHook(id, repositoryId, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}