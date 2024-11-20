// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetTesterQueryResponse, GetTesterQueryParams } from "../types/GetTester.ts";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getTesterSuspenseQueryKey = (params?: GetTesterQueryParams) => [{ url: "/api/Test" }, ...(params ? [params] : [])] as const;

 export type GetTesterSuspenseQueryKey = ReturnType<typeof getTesterSuspenseQueryKey>;

 /**
 * @link /api/Test
 */
async function getTesterHook(params?: GetTesterQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetTesterQueryResponse, Error, unknown>({ method: "GET", url: `/api/Test`, params, ...config });
    return res.data;
}

 export function getTesterSuspenseQueryOptionsHook(params?: GetTesterQueryParams, config: Partial<RequestConfig> = {}) {
    const queryKey = getTesterSuspenseQueryKey(params);
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
export function useGetTesterSuspenseHook<TData = GetTesterQueryResponse, TQueryData = GetTesterQueryResponse, TQueryKey extends QueryKey = GetTesterSuspenseQueryKey>(params?: GetTesterQueryParams, options: {
    query?: Partial<UseSuspenseQueryOptions<GetTesterQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getTesterSuspenseQueryKey(params);
    const query = useSuspenseQuery({
        ...getTesterSuspenseQueryOptionsHook(params, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}