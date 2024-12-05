// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from "../types/GetProjects";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getProjectsQueryKey = (params?: GetProjectsQueryParams) => [{ url: "/api/Projects" }, ...(params ? [params] : [])] as const;

 export type GetProjectsQueryKey = ReturnType<typeof getProjectsQueryKey>;

 /**
 * @link /api/Projects
 */
async function getProjectsHook(params?: GetProjectsQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectsQueryResponse, Error, unknown>({ method: "GET", url: `/api/Projects`, params, ...config });
    return res.data;
}

 export function getProjectsQueryOptionsHook(params?: GetProjectsQueryParams, config: Partial<RequestConfig> = {}) {
    const queryKey = getProjectsQueryKey(params);
    return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getProjectsHook(params, config);
        },
    });
}

 /**
 * @link /api/Projects
 */
export function useGetProjectsHook<TData = GetProjectsQueryResponse, TQueryData = GetProjectsQueryResponse, TQueryKey extends QueryKey = GetProjectsQueryKey>(params?: GetProjectsQueryParams, options: {
    query?: Partial<QueryObserverOptions<GetProjectsQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectsQueryKey(params);
    const query = useQuery({
        ...getProjectsQueryOptionsHook(params, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}