// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from "../types/GetProjects.ts";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getProjectsSuspenseQueryKey = (params?: GetProjectsQueryParams) => [{ url: "/api/Projects" }, ...(params ? [params] : [])] as const;

 export type GetProjectsSuspenseQueryKey = ReturnType<typeof getProjectsSuspenseQueryKey>;

 /**
 * @link /api/Projects
 */
async function getProjectsHook(params?: GetProjectsQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectsQueryResponse, Error, unknown>({ method: "GET", url: `/api/Projects`, params, ...config });
    return res.data;
}

 export function getProjectsSuspenseQueryOptionsHook(params?: GetProjectsQueryParams, config: Partial<RequestConfig> = {}) {
    const queryKey = getProjectsSuspenseQueryKey(params);
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
export function useGetProjectsSuspenseHook<TData = GetProjectsQueryResponse, TQueryData = GetProjectsQueryResponse, TQueryKey extends QueryKey = GetProjectsSuspenseQueryKey>(params?: GetProjectsQueryParams, options: {
    query?: Partial<UseSuspenseQueryOptions<GetProjectsQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectsSuspenseQueryKey(params);
    const query = useSuspenseQuery({
        ...getProjectsSuspenseQueryOptionsHook(params, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}