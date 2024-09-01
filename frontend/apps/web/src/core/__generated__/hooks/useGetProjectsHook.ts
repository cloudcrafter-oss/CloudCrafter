import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from "../types/GetProjects";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, InfiniteData, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetProjectsClient = typeof client<GetProjectsQueryResponse, never, never>;
type GetProjects = {
    data: GetProjectsQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: GetProjectsQueryParams;
    headerParams: never;
    response: GetProjectsQueryResponse;
    client: {
        parameters: Partial<Parameters<GetProjectsClient>[0]>;
        return: Awaited<ReturnType<GetProjectsClient>>;
    };
};
export const getProjectsQueryKey = (params?: GetProjects["queryParams"]) => [{ url: "/api/Projects" }, ...(params ? [params] : [])] as const;
export type GetProjectsQueryKey = ReturnType<typeof getProjectsQueryKey>;
export function getProjectsQueryOptions(params?: GetProjects["queryParams"], options: GetProjects["client"]["parameters"] = {}) {
    const queryKey = getProjectsQueryKey(params);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetProjects["data"], GetProjects["error"]>({
                method: "get",
                url: `/api/Projects`,
                params,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Projects
 */
export function useGetProjectsHook<TData = GetProjects["response"], TQueryData = GetProjects["response"], TQueryKey extends QueryKey = GetProjectsQueryKey>(params?: GetProjects["queryParams"], options: {
    query?: Partial<QueryObserverOptions<GetProjects["response"], GetProjects["error"], TData, TQueryData, TQueryKey>>;
    client?: GetProjects["client"]["parameters"];
} = {}): UseQueryResult<TData, GetProjects["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectsQueryKey(params);
    const query = useQuery({
        ...getProjectsQueryOptions(params, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetProjects["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getProjectsInfiniteQueryKey = (params?: GetProjects["queryParams"]) => [{ url: "/api/Projects" }, ...(params ? [params] : [])] as const;
export type GetProjectsInfiniteQueryKey = ReturnType<typeof getProjectsInfiniteQueryKey>;
export function getProjectsInfiniteQueryOptions(params?: GetProjects["queryParams"], options: GetProjects["client"]["parameters"] = {}) {
    const queryKey = getProjectsInfiniteQueryKey(params);
    return infiniteQueryOptions({
        queryKey,
        queryFn: async ({ pageParam }) => {
            const res = await client<GetProjects["data"], GetProjects["error"]>({
                method: "get",
                url: `/api/Projects`,
                ...options,
                params: {
                    ...params,
                    ["id"]: pageParam,
                    ...(options.params || {}),
                }
            });
            return res.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}
/**
 * @link /api/Projects
 */
export function useGetProjectsHookInfinite<TData = InfiniteData<GetProjects["response"]>, TQueryData = GetProjects["response"], TQueryKey extends QueryKey = GetProjectsInfiniteQueryKey>(params?: GetProjects["queryParams"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProjects["response"], GetProjects["error"], TData, TQueryData, TQueryKey>>;
    client?: GetProjects["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetProjects["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectsInfiniteQueryKey(params);
    const query = useInfiniteQuery({
        ...getProjectsInfiniteQueryOptions(params, clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetProjects["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getProjectsSuspenseQueryKey = (params?: GetProjects["queryParams"]) => [{ url: "/api/Projects" }, ...(params ? [params] : [])] as const;
export type GetProjectsSuspenseQueryKey = ReturnType<typeof getProjectsSuspenseQueryKey>;
export function getProjectsSuspenseQueryOptions(params?: GetProjects["queryParams"], options: GetProjects["client"]["parameters"] = {}) {
    const queryKey = getProjectsSuspenseQueryKey(params);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetProjects["data"], GetProjects["error"]>({
                method: "get",
                url: `/api/Projects`,
                params,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Projects
 */
export function useGetProjectsHookSuspense<TData = GetProjects["response"], TQueryKey extends QueryKey = GetProjectsSuspenseQueryKey>(params?: GetProjects["queryParams"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetProjects["response"], GetProjects["error"], TData, TQueryKey>>;
    client?: GetProjects["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetProjects["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectsSuspenseQueryKey(params);
    const query = useSuspenseQuery({
        ...getProjectsSuspenseQueryOptions(params, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetProjects["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}