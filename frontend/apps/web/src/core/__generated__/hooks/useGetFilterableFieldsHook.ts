// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetFilterableFieldsQueryResponse } from "../types/GetFilterableFields.ts";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getFilterableFieldsQueryKey = () => [{ url: "/api/System/get-fields" }] as const;

 export type GetFilterableFieldsQueryKey = ReturnType<typeof getFilterableFieldsQueryKey>;

 /**
 * @link /api/System/get-fields
 */
async function getFilterableFieldsHook(config: Partial<RequestConfig> = {}) {
    const res = await client<GetFilterableFieldsQueryResponse, Error, unknown>({ method: "GET", url: `/api/System/get-fields`, ...config });
    return res.data;
}

 export function getFilterableFieldsQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = getFilterableFieldsQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getFilterableFieldsHook(config);
        },
    });
}

 /**
 * @link /api/System/get-fields
 */
export function useGetFilterableFieldsHook<TData = GetFilterableFieldsQueryResponse, TQueryData = GetFilterableFieldsQueryResponse, TQueryKey extends QueryKey = GetFilterableFieldsQueryKey>(options: {
    query?: Partial<QueryObserverOptions<GetFilterableFieldsQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getFilterableFieldsQueryKey();
    const query = useQuery({
        ...getFilterableFieldsQueryOptionsHook(config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}