import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { TestQueryResponse } from "../types/Test.ts";
import type { QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

 export const testSuspenseQueryKey = () => [{ url: "/api/Users/test" }] as const;

 export type TestSuspenseQueryKey = ReturnType<typeof testSuspenseQueryKey>;

 /**
 * @link /api/Users/test
 */
async function testHook(config: Partial<RequestConfig> = {}) {
    const res = await client<TestQueryResponse, Error, unknown>({ method: "GET", url: `/api/Users/test`, ...config });
    return res.data;
}

 export function testSuspenseQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = testSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async ({ signal }) => {
            config.signal = signal;
            return testHook(config);
        },
    });
}

 /**
 * @link /api/Users/test
 */
export function useTestSuspenseHook<TData = TestQueryResponse, TQueryData = TestQueryResponse, TQueryKey extends QueryKey = TestSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<TestQueryResponse, Error, TData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? testSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...testSuspenseQueryOptionsHook(config) as unknown as UseSuspenseQueryOptions,
        queryKey,
        ...queryOptions as unknown as Omit<UseSuspenseQueryOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}