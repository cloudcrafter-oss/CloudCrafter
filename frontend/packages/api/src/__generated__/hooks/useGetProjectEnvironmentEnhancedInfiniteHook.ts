// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhancedPathParams, GetProjectEnvironmentEnhanced404 } from "../types/GetProjectEnvironmentEnhanced";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getProjectEnvironmentEnhancedInfiniteQueryKey = (id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"]) => [{ url: "/api/Projects/:id/:environmentId", params: { id: id, environmentId: environmentId } }] as const;

 export type GetProjectEnvironmentEnhancedInfiniteQueryKey = ReturnType<typeof getProjectEnvironmentEnhancedInfiniteQueryKey>;

 /**
 * {@link /api/Projects/:id/:environmentId}
 */
async function getProjectEnvironmentEnhancedHook(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhanced404, unknown>({ method: "GET", url: `/api/Projects/${id}/${environmentId}`, ...config });
    return res.data;
}

 export function getProjectEnvironmentEnhancedInfiniteQueryOptionsHook(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], config: Partial<RequestConfig> = {}) {
    const queryKey = getProjectEnvironmentEnhancedInfiniteQueryKey(id, environmentId);
    return infiniteQueryOptions({
        enabled: !!(id && environmentId),
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return getProjectEnvironmentEnhancedHook(id, environmentId, config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * {@link /api/Projects/:id/:environmentId}
 */
export function useGetProjectEnvironmentEnhancedInfiniteHook<TData = InfiniteData<GetProjectEnvironmentEnhancedQueryResponse>, TQueryData = GetProjectEnvironmentEnhancedQueryResponse, TQueryKey extends QueryKey = GetProjectEnvironmentEnhancedInfiniteQueryKey>(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhanced404, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectEnvironmentEnhancedInfiniteQueryKey(id, environmentId);
    const query = useInfiniteQuery({
        ...getProjectEnvironmentEnhancedInfiniteQueryOptionsHook(id, environmentId, config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetProjectEnvironmentEnhanced404> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}