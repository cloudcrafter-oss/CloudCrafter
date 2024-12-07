// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetFilterableFieldsQueryResponse } from "../types/GetFilterableFields";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getFilterableFieldsSuspenseQueryKey = () => [{ url: "/api/System/get-fields" }] as const;

 export type GetFilterableFieldsSuspenseQueryKey = ReturnType<typeof getFilterableFieldsSuspenseQueryKey>;

 /**
 * {@link /api/System/get-fields}
 */
async function getFilterableFieldsHook(config: Partial<RequestConfig> = {}) {
    const res = await client<GetFilterableFieldsQueryResponse, Error, unknown>({ method: "GET", url: `/api/System/get-fields`, ...config });
    return res.data;
}

 export function getFilterableFieldsSuspenseQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = getFilterableFieldsSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getFilterableFieldsHook(config);
        },
    });
}

 /**
 * {@link /api/System/get-fields}
 */
export function useGetFilterableFieldsSuspenseHook<TData = GetFilterableFieldsQueryResponse, TQueryData = GetFilterableFieldsQueryResponse, TQueryKey extends QueryKey = GetFilterableFieldsSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<GetFilterableFieldsQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getFilterableFieldsSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...getFilterableFieldsSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}