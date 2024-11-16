import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetStackDetailQueryResponse, GetStackDetailPathParams, GetStackDetail404 } from "../types/GetStackDetail.ts";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getStackDetailQueryKey = (id: GetStackDetailPathParams["id"]) => [{ url: "/api/Stacks/:id", params: { id: id } }] as const;

 export type GetStackDetailQueryKey = ReturnType<typeof getStackDetailQueryKey>;

 /**
 * @link /api/Stacks/:id
 */
async function getStackDetailHook(id: GetStackDetailPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetStackDetailQueryResponse, GetStackDetail404, unknown>({ method: "GET", url: `/api/Stacks/${id}`, ...config });
    return res.data;
}

 export function getStackDetailQueryOptionsHook(id: GetStackDetailPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getStackDetailQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getStackDetailHook(id, config);
        },
    });
}

 /**
 * @link /api/Stacks/:id
 */
export function useGetStackDetailHook<TData = GetStackDetailQueryResponse, TQueryData = GetStackDetailQueryResponse, TQueryKey extends QueryKey = GetStackDetailQueryKey>(id: GetStackDetailPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetStackDetailQueryResponse, GetStackDetail404, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getStackDetailQueryKey(id);
    const query = useQuery({
        ...getStackDetailQueryOptionsHook(id, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetStackDetail404> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}