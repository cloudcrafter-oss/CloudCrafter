// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetTesterQueryResponse, GetTesterQueryParams } from "../types/GetTester.ts";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getTesterQueryKey = (params?: GetTesterQueryParams) => [{ url: "/api/Test" }, ...(params ? [params] : [])] as const;

 export type GetTesterQueryKey = ReturnType<typeof getTesterQueryKey>;

 /**
 * @link /api/Test
 */
async function getTesterHook(params?: GetTesterQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetTesterQueryResponse, Error, unknown>({ method: "GET", url: `/api/Test`, params, ...config });
    return res.data;
}

 export function getTesterQueryOptionsHook(params?: GetTesterQueryParams, config: Partial<RequestConfig> = {}) {
    const queryKey = getTesterQueryKey(params);
    return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getTesterHook(params, config);
        },
    });
}

 /**
 * @link /api/Test
 */
export function useGetTesterHook<TData = GetTesterQueryResponse, TQueryData = GetTesterQueryResponse, TQueryKey extends QueryKey = GetTesterQueryKey>(params?: GetTesterQueryParams, options: {
    query?: Partial<QueryObserverOptions<GetTesterQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getTesterQueryKey(params);
    const query = useQuery({
        ...getTesterQueryOptionsHook(params, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}