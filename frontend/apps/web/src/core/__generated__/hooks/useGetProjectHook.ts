import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetProjectQueryResponse, GetProjectPathParams, GetProject404 } from "../types/GetProject";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetProjectClient = typeof client<GetProjectQueryResponse, GetProject404, never>;
type GetProject = {
    data: GetProjectQueryResponse;
    error: GetProject404;
    request: never;
    pathParams: GetProjectPathParams;
    queryParams: never;
    headerParams: never;
    response: GetProjectQueryResponse;
    client: {
        parameters: Partial<Parameters<GetProjectClient>[0]>;
        return: Awaited<ReturnType<GetProjectClient>>;
    };
};
export const getProjectQueryKey = (id: GetProjectPathParams["id"]) => [{ url: "/api/Projects/:id", params: { id: id } }] as const;
export type GetProjectQueryKey = ReturnType<typeof getProjectQueryKey>;
export function getProjectQueryOptions(id: GetProjectPathParams["id"], options: GetProject["client"]["parameters"] = {}) {
    const queryKey = getProjectQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetProject["data"], GetProject["error"]>({
                method: "get",
                url: `/api/Projects/${id}`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Projects/:id
 */
export function useGetProjectHook<TData = GetProject["response"], TQueryData = GetProject["response"], TQueryKey extends QueryKey = GetProjectQueryKey>(id: GetProjectPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetProject["response"], GetProject["error"], TData, TQueryData, TQueryKey>>;
    client?: GetProject["client"]["parameters"];
} = {}): UseQueryResult<TData, GetProject["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectQueryKey(id);
    const query = useQuery({
        ...getProjectQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetProject["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getProjectInfiniteQueryKey = (id: GetProjectPathParams["id"]) => [{ url: "/api/Projects/:id", params: { id: id } }] as const;
export type GetProjectInfiniteQueryKey = ReturnType<typeof getProjectInfiniteQueryKey>;
export function getProjectInfiniteQueryOptions(id: GetProjectPathParams["id"], options: GetProject["client"]["parameters"] = {}) {
    const queryKey = getProjectInfiniteQueryKey(id);
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<GetProject["data"], GetProject["error"]>({
                method: "get",
                url: `/api/Projects/${id}`,
                ...options
            });
            return res.data;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}
/**
 * @link /api/Projects/:id
 */
export function useGetProjectHookInfinite<TData = GetProject["response"], TQueryData = GetProject["response"], TQueryKey extends QueryKey = GetProjectInfiniteQueryKey>(id: GetProjectPathParams["id"], options: {
    query?: Partial<InfiniteQueryObserverOptions<GetProject["response"], GetProject["error"], TData, TQueryData, TQueryKey>>;
    client?: GetProject["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, GetProject["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectInfiniteQueryKey(id);
    const query = useInfiniteQuery({
        ...getProjectInfiniteQueryOptions(id, clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, GetProject["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getProjectSuspenseQueryKey = (id: GetProjectPathParams["id"]) => [{ url: "/api/Projects/:id", params: { id: id } }] as const;
export type GetProjectSuspenseQueryKey = ReturnType<typeof getProjectSuspenseQueryKey>;
export function getProjectSuspenseQueryOptions(id: GetProjectPathParams["id"], options: GetProject["client"]["parameters"] = {}) {
    const queryKey = getProjectSuspenseQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetProject["data"], GetProject["error"]>({
                method: "get",
                url: `/api/Projects/${id}`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Projects/:id
 */
export function useGetProjectHookSuspense<TData = GetProject["response"], TQueryKey extends QueryKey = GetProjectSuspenseQueryKey>(id: GetProjectPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetProject["response"], GetProject["error"], TData, TQueryKey>>;
    client?: GetProject["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetProject["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getProjectSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getProjectSuspenseQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetProject["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}