// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetGitRepositoriesQueryResponse, GetGitRepositoriesPathParams } from "../types/GetGitRepositories";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getGitRepositoriesSuspenseQueryKey = (id: GetGitRepositoriesPathParams["id"]) => [{ url: "/api/Providers/:id/repositories", params: { id: id } }] as const;

 export type GetGitRepositoriesSuspenseQueryKey = ReturnType<typeof getGitRepositoriesSuspenseQueryKey>;

 /**
 * {@link /api/Providers/:id/repositories}
 */
async function getGitRepositoriesHook(id: GetGitRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGitRepositoriesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/${id}/repositories`, ...config });
    return res.data;
}

 export function getGitRepositoriesSuspenseQueryOptionsHook(id: GetGitRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getGitRepositoriesSuspenseQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getGitRepositoriesHook(id, config);
        },
    });
}

 /**
 * {@link /api/Providers/:id/repositories}
 */
export function useGetGitRepositoriesSuspenseHook<TData = GetGitRepositoriesQueryResponse, TQueryData = GetGitRepositoriesQueryResponse, TQueryKey extends QueryKey = GetGitRepositoriesSuspenseQueryKey>(id: GetGitRepositoriesPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetGitRepositoriesQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGitRepositoriesSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getGitRepositoriesSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}