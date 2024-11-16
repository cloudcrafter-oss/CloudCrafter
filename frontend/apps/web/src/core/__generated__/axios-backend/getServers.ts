import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetServersQueryResponse } from "../types/GetServers.ts";

 /**
 * @link /api/Servers
 */
export async function getServers(config: Partial<RequestConfig> = {}) {
    const res = await client<GetServersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers`, ...config });
    return res.data;
}