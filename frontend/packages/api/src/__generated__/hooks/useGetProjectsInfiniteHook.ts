// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from "../types/GetProjects";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const getProjectsInfiniteQueryKey = (params?: GetProjectsQueryParams) => [{ url: "/api/Projects" }, ...(params ? [params] : [])] as const;

 export type GetProjectsInfiniteQueryKey = ReturnType<typeof getProjectsInfiniteQueryKey>;

 /**
 * @link /api/Projects
 */
async function getProjectsHook(params?: GetProjectsQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectsQueryResponse, Error, unknown>({ method: "GET", url: `/api/Projects`, params, ...config });
    return res.data;
}

 export function getProjectsInfiniteQueryOptionsHook(params?: GetProjectsQueryParams, config: Partial<RequestConfig> = {}) {
    const queryKey = getProjectsInfiniteQueryKey(params);
    return infiniteQueryOptions({
        queryKey,
        queryFn: async ({ signal, pageParam }) => {
            config.signal = signal;
            if (params) {
                params["id"] = pageParam as unknown as GetProjectsQueryParams["id"];
            }
            return getProjectsHook(params, config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * @link /api/Projects
 */
export function useGetProjectsInfiniteHook<TData = InfiniteData<GetProjectsQueryResponse>, TQueryData = GetProjectsQueryResponse, TQueryKey extends QueryKey = GetProjectsInfiniteQueryKey>(params?: GetProjectsQueryParams, options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProjectsQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectsInfiniteQueryKey(params);
    const query = useInfiniteQuery({
        ...getProjectsInfiniteQueryOptionsHook(params, config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}