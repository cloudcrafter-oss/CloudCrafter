// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetDeploymentsForStackQueryResponse, GetDeploymentsForStackPathParams } from "../types/GetDeploymentsForStack.ts";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const getDeploymentsForStackSuspenseQueryKey = (id: GetDeploymentsForStackPathParams["id"]) => [{ url: "/api/Stacks/:id/deployments", params: { id: id } }] as const;

 export type GetDeploymentsForStackSuspenseQueryKey = ReturnType<typeof getDeploymentsForStackSuspenseQueryKey>;

 /**
 * @link /api/Stacks/:id/deployments
 */
async function getDeploymentsForStackHook(id: GetDeploymentsForStackPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentsForStackQueryResponse, Error, unknown>({ method: "GET", url: `/api/Stacks/${id}/deployments`, ...config });
    return res.data;
}

 export function getDeploymentsForStackSuspenseQueryOptionsHook(id: GetDeploymentsForStackPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getDeploymentsForStackSuspenseQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getDeploymentsForStackHook(id, config);
        },
    });
}

 /**
 * @link /api/Stacks/:id/deployments
 */
export function useGetDeploymentsForStackSuspenseHook<TData = GetDeploymentsForStackQueryResponse, TQueryData = GetDeploymentsForStackQueryResponse, TQueryKey extends QueryKey = GetDeploymentsForStackSuspenseQueryKey>(id: GetDeploymentsForStackPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetDeploymentsForStackQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getDeploymentsForStackSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getDeploymentsForStackSuspenseQueryOptionsHook(id, config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}