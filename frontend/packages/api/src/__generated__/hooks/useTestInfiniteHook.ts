// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { TestQueryResponse } from "../types/Test";
import type { InfiniteData, QueryKey, InfiniteQueryObserverOptions, UseInfiniteQueryResult } from "@tanstack/react-query";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

 export const testInfiniteQueryKey = () => [{ url: "/api/Users/test" }] as const;

 export type TestInfiniteQueryKey = ReturnType<typeof testInfiniteQueryKey>;

 /**
 * @link /api/Users/test
 */
async function testHook(config: Partial<RequestConfig> = {}) {
    const res = await client<TestQueryResponse, Error, unknown>({ method: "GET", url: `/api/Users/test`, ...config });
    return res.data;
}

 export function testInfiniteQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = testInfiniteQueryKey();
    return infiniteQueryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return testHook(config);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => Array.isArray(lastPage) && lastPage.length === 0 ? undefined : lastPageParam + 1,
        getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => firstPageParam <= 1 ? undefined : firstPageParam - 1
    });
}

 /**
 * @link /api/Users/test
 */
export function useTestInfiniteHook<TData = InfiniteData<TestQueryResponse>, TQueryData = TestQueryResponse, TQueryKey extends QueryKey = TestInfiniteQueryKey>(options: {
    query?: Partial<InfiniteQueryObserverOptions<TestQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? testInfiniteQueryKey();
    const query = useInfiniteQuery({
        ...testInfiniteQueryOptionsHook(config) as unknown as InfiniteQueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<InfiniteQueryObserverOptions, "queryKey">
    }) as UseInfiniteQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}