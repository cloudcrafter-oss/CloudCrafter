import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { TestQueryResponse } from "../types/Test.ts";

 /**
 * @link /api/Users/test
 */
export async function test(config: Partial<RequestConfig> = {}) {
    const res = await client<TestQueryResponse, Error, unknown>({ method: "GET", url: `/api/Users/test`, ...config });
    return res.data;
}