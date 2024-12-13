// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetGitRepositoriesQueryResponse, GetGitRepositoriesPathParams } from "../types/GetGitRepositories";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getGitRepositoriesQueryKey = (id: GetGitRepositoriesPathParams["id"]) => [{ url: "/api/Providers/:id/repositories", params: { id: id } }] as const;

 export type GetGitRepositoriesQueryKey = ReturnType<typeof getGitRepositoriesQueryKey>;

 /**
 * {@link /api/Providers/:id/repositories}
 */
async function getGitRepositoriesHook(id: GetGitRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGitRepositoriesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/${id}/repositories`, ...config });
    return res.data;
}

 export function getGitRepositoriesQueryOptionsHook(id: GetGitRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getGitRepositoriesQueryKey(id);
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
export function useGetGitRepositoriesHook<TData = GetGitRepositoriesQueryResponse, TQueryData = GetGitRepositoriesQueryResponse, TQueryKey extends QueryKey = GetGitRepositoriesQueryKey>(id: GetGitRepositoriesPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetGitRepositoriesQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGitRepositoriesQueryKey(id);
    const query = useQuery({
        ...getGitRepositoriesQueryOptionsHook(id, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}