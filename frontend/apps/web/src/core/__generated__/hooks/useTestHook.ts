import client from "../../frontend/client.ts";
import { useQuery, queryOptions, useInfiniteQuery, infiniteQueryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { TestQueryResponse } from "../types/Test";
import type { QueryObserverOptions, UseQueryResult, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type TestClient = typeof client<TestQueryResponse, Error, never>;
type Test = {
    data: TestQueryResponse;
    error: Error;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: TestQueryResponse;
    client: {
        parameters: Partial<Parameters<TestClient>[0]>;
        return: Awaited<ReturnType<TestClient>>;
    };
};
export const testQueryKey = () => [{ url: "/api/Users/test" }] as const;
export type TestQueryKey = ReturnType<typeof testQueryKey>;
export function testQueryOptions(options: Test["client"]["parameters"] = {}) {
    const queryKey = testQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<Test["data"], Test["error"]>({
                method: "get",
                url: `/api/Users/test`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Users/test
 */
export function useTestHook<TData = Test["response"], TQueryData = Test["response"], TQueryKey extends QueryKey = TestQueryKey>(options: {
    query?: Partial<QueryObserverOptions<Test["response"], Test["error"], TData, TQueryData, TQueryKey>>;
    client?: Test["client"]["parameters"];
} = {}): UseQueryResult<TData, Test["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? testQueryKey();
    const query = useQuery({
        ...testQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Test["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const testInfiniteQueryKey = () => [{ url: "/api/Users/test" }] as const;
export type TestInfiniteQueryKey = ReturnType<typeof testInfiniteQueryKey>;
export function testInfiniteQueryOptions(options: Test["client"]["parameters"] = {}) {
    const queryKey = testInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
// @ts-ignore pageParam is declared but its value is possibly never read
        queryFn: async ({ pageParam }) => {
            const res = await client<Test["data"], Test["error"]>({
                method: "get",
                url: `/api/Users/test`,
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
 * @link /api/Users/test
 */
export function useTestHookInfinite<TData = Test["response"], TQueryData = Test["response"], TQueryKey extends QueryKey = TestInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<Test["response"], Test["error"], TData, TQueryData, TQueryKey>>;
    client?: Test["client"]["parameters"];
} = {}): UseInfiniteQueryResult<TData, Test["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? testInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...testInfiniteQueryOptions(clientOptions) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Test["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const testSuspenseQueryKey = () => [{ url: "/api/Users/test" }] as const;
export type TestSuspenseQueryKey = ReturnType<typeof testSuspenseQueryKey>;
export function testSuspenseQueryOptions(options: Test["client"]["parameters"] = {}) {
    const queryKey = testSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<Test["data"], Test["error"]>({
                method: "get",
                url: `/api/Users/test`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /api/Users/test
 */
export function useTestHookSuspense<TData = Test["response"], TQueryKey extends QueryKey = TestSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<Test["response"], Test["error"], TData, TQueryKey>>;
    client?: Test["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, Test["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? testSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...testSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Test["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}