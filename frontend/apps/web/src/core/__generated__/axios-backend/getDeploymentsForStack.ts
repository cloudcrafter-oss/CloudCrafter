import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetDeploymentsForStackQueryResponse, GetDeploymentsForStackPathParams } from "../types/GetDeploymentsForStack.ts";

 /**
 * @link /api/Stacks/:id/deployments
 */
export async function getDeploymentsForStack(id: GetDeploymentsForStackPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentsForStackQueryResponse, Error, unknown>({ method: "GET", url: `/api/Stacks/${id}/deployments`, ...config });
    return res.data;
}