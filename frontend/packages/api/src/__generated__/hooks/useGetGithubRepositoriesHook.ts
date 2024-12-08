// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetGithubRepositoriesQueryResponse, GetGithubRepositoriesPathParams } from "../types/GetGithubRepositories";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getGithubRepositoriesQueryKey = (id: GetGithubRepositoriesPathParams["id"]) => [{ url: "/api/Providers/github/:id/repositories", params: { id: id } }] as const;

 export type GetGithubRepositoriesQueryKey = ReturnType<typeof getGithubRepositoriesQueryKey>;

 /**
 * {@link /api/Providers/github/:id/repositories}
 */
async function getGithubRepositoriesHook(id: GetGithubRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGithubRepositoriesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/github/${id}/repositories`, ...config });
    return res.data;
}

 export function getGithubRepositoriesQueryOptionsHook(id: GetGithubRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getGithubRepositoriesQueryKey(id);
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
export function useGetGithubRepositoriesHook<TData = GetGithubRepositoriesQueryResponse, TQueryData = GetGithubRepositoriesQueryResponse, TQueryKey extends QueryKey = GetGithubRepositoriesQueryKey>(id: GetGithubRepositoriesPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetGithubRepositoriesQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getGithubRepositoriesQueryKey(id);
    const query = useQuery({
        ...getGithubRepositoriesQueryOptionsHook(id, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}