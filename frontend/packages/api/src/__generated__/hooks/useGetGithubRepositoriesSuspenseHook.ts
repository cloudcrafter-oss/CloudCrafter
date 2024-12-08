// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetGithubRepositoriesQueryResponse, GetGithubRepositoriesPathParams } from "../types/GetGithubRepositories";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getGithubRepositoriesSuspenseQueryKey = (id: GetGithubRepositoriesPathParams["id"]) => [{ url: "/api/Providers/github/:id/repositories", params: { id: id } }] as const;

 export type GetGithubRepositoriesSuspenseQueryKey = ReturnType<typeof getGithubRepositoriesSuspenseQueryKey>;

 /**
 * {@link /api/Providers/github/:id/repositories}
 */
async function getGithubRepositoriesHook(id: GetGithubRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGithubRepositoriesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/github/${id}/repositories`, ...config });
    return res.data;
}

 export function getGithubRepositoriesSuspenseQueryOptionsHook(id: GetGithubRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getGithubRepositoriesSuspenseQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getGithubRepositoriesHook(id, config);
        },
    });
}

 /**
 * {@link /api/Providers/github/:id/repositories}
 */
export function useGetGithubRepositoriesSuspenseHook<TData = GetGithubRepositoriesQueryResponse, TQueryData = GetGithubRepositoriesQueryResponse, TQueryKey extends QueryKey = GetGithubRepositoriesSuspenseQueryKey>(id: GetGithubRepositoriesPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetGithubRepositoriesQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGithubRepositoriesSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getGithubRepositoriesSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}