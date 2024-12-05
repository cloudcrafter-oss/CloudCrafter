import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetServersQueryResponse } from "../types/GetServers";

 /**
 * @link /api/Servers
 */
export async function getServers(config: Partial<RequestConfig> = {}) {
    const res = await client<GetServersQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers`, ...config });
    return res.data;
}