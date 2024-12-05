// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetDeploymentsForServerQueryResponse, GetDeploymentsForServerPathParams, GetDeploymentsForServerQueryParams } from "../types/GetDeploymentsForServer";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getDeploymentsForServerSuspenseQueryKey = (id: GetDeploymentsForServerPathParams["id"], params?: GetDeploymentsForServerQueryParams) => [{ url: "/api/Servers/:id/deployments", params: { id: id } }, ...(params ? [params] : [])] as const;

 export type GetDeploymentsForServerSuspenseQueryKey = ReturnType<typeof getDeploymentsForServerSuspenseQueryKey>;

 /**
 * {@link /api/Servers/:id/deployments}
 */
async function getDeploymentsForServerHook(id: GetDeploymentsForServerPathParams["id"], params?: GetDeploymentsForServerQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentsForServerQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}/deployments`, params, ...config });
    return res.data;
}

 export function getDeploymentsForServerSuspenseQueryOptionsHook(id: GetDeploymentsForServerPathParams["id"], params?: GetDeploymentsForServerQueryParams, config: Partial<RequestConfig> = {}) {
    const queryKey = getDeploymentsForServerSuspenseQueryKey(id, params);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getDeploymentsForServerHook(id, params, config);
        },
    });
}

 /**
 * {@link /api/Servers/:id/deployments}
 */
export function useGetDeploymentsForServerSuspenseHook<TData = GetDeploymentsForServerQueryResponse, TQueryData = GetDeploymentsForServerQueryResponse, TQueryKey extends QueryKey = GetDeploymentsForServerSuspenseQueryKey>(id: GetDeploymentsForServerPathParams["id"], params?: GetDeploymentsForServerQueryParams, options: {
    query?: Partial<UseSuspenseQueryOptions<GetDeploymentsForServerQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentsForServerSuspenseQueryKey(id, params);
    const query = useSuspenseQuery({
        ...getDeploymentsForServerSuspenseQueryOptionsHook(id, params, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}