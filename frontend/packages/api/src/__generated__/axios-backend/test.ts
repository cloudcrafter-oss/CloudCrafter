import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { TestQueryResponse } from "../types/Test";

 /**
 * {@link /api/Users/test}
 */
export async function test(config: Partial<RequestConfig> = {}) {
    const res = await client<TestQueryResponse, Error, unknown>({ method: "GET", url: `/api/Users/test`, ...config });
    return res.data;
}