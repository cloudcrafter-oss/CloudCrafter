import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetTesterQueryResponse, GetTesterQueryParams } from "../types/GetTester.ts";

 /**
 * @link /api/Test
 */
export async function getTester(params?: GetTesterQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetTesterQueryResponse, Error, unknown>({ method: "GET", url: `/api/Test`, params, ...config });
    return res.data;
}