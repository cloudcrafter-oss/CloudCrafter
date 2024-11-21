import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetDeploymentsForServerQueryResponse, GetDeploymentsForServerPathParams, GetDeploymentsForServerQueryParams } from "../types/GetDeploymentsForServer.ts";

 /**
 * @link /api/Servers/:id/deployments
 */
export async function getDeploymentsForServer(id: GetDeploymentsForServerPathParams["id"], params?: GetDeploymentsForServerQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentsForServerQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}/deployments`, params, ...config });
    return res.data;
}