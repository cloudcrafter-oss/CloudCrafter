import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetDeploymentsForServerQueryResponse, GetDeploymentsForServerPathParams } from "../types/GetDeploymentsForServer.ts";

 /**
 * @link /api/Servers/:id/deployments
 */
export async function getDeploymentsForServer(id: GetDeploymentsForServerPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentsForServerQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}/deployments`, ...config });
    return res.data;
}