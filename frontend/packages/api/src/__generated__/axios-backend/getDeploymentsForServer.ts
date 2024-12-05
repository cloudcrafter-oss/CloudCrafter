import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetDeploymentsForServerQueryResponse, GetDeploymentsForServerPathParams, GetDeploymentsForServerQueryParams } from "../types/GetDeploymentsForServer";

 /**
 * @link /api/Servers/:id/deployments
 */
export async function getDeploymentsForServer(id: GetDeploymentsForServerPathParams["id"], params?: GetDeploymentsForServerQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentsForServerQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}/deployments`, params, ...config });
    return res.data;
}