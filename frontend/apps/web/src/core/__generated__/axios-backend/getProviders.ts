import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetProvidersQueryResponse } from "../types/GetProviders.ts";

 /**
 * @link /api/Providers
 */
export async function getProviders(config: Partial<RequestConfig> = {}) {
    const res = await client<GetProvidersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers`, ...config });
    return res.data;
}