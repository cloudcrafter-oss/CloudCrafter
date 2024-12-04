// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { TestQueryResponse } from "../types/Test.ts";
import type { QueryKey, QueryObserverOptions, UseQueryResult } from "@tanstack/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

 export const testQueryKey = () => [{ url: "/api/Users/test" }] as const;

 export type TestQueryKey = ReturnType<typeof testQueryKey>;

 /**
 * @link /api/Users/test
 */
async function testHook(config: Partial<RequestConfig> = {}) {
    const res = await client<TestQueryResponse, Error, unknown>({ method: "GET", url: `/api/Users/test`, ...config });
    return res.data;
}

 export function testQueryOptionsHook(config: Partial<RequestConfig> = {}) {
    const queryKey = testQueryKey();
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
export function useTestHook<TData = TestQueryResponse, TQueryData = TestQueryResponse, TQueryKey extends QueryKey = TestQueryKey>(options: {
    query?: Partial<QueryObserverOptions<TestQueryResponse, Error, TData, TQueryData, TQueryKey>>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { query: queryOptions, client: config = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? testQueryKey();
    const query = useQuery({
        ...testQueryOptionsHook(config) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Error> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}