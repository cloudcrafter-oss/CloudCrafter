import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { GetProjectQueryResponse, GetProjectPathParams, GetProject404 } from "../types/GetProject.ts";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const getProjectQueryKey = (id: GetProjectPathParams["id"]) => [{ url: "/api/Projects/:id", params: { id: id } }] as const;

 export type GetProjectQueryKey = ReturnType<typeof getProjectQueryKey>;

 /**
 * @link /api/Projects/:id
 */
async function getProjectHook(id: GetProjectPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectQueryResponse, GetProject404, unknown>({ method: "GET", url: `/api/Projects/${id}`, ...config });
    return res.data;
}

 export function getProjectQueryOptionsHook(id: GetProjectPathParams["id"], config: Partial<RequestConfig> = {}) {
    const queryKey = getProjectQueryKey(id);
    return queryOptions({
        enabled: !!(id),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getProjectHook(id, config);
        },
    });
}

 /**
 * @link /api/Projects/:id
 */
export function useGetProjectHook<TData = GetProjectQueryResponse, TQueryData = GetProjectQueryResponse, TQueryKey extends QueryKey = GetProjectQueryKey>(id: GetProjectPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetProjectQueryResponse, GetProject404, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectQueryKey(id);
    const query = useQuery({
        ...getProjectQueryOptionsHook(id, config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetProject404> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}