import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetProvidersQueryResponse, GetProvidersQueryParams } from "../types/GetProviders";

 /**
 * {@link /api/Providers}
 */
export async function getProviders(params?: GetProvidersQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetProvidersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers`, params, ...config });
    return res.data;
}