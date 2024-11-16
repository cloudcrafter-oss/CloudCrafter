import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { GetDeploymentsForStackQueryResponse, GetDeploymentsForStackPathParams } from "../types/GetDeploymentsForStack";

 /**
 * @link /api/Stacks/:id/deployments
 */
export async function getDeploymentsForStack(id: GetDeploymentsForStackPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetDeploymentsForStackQueryResponse>["data"]> {
    const res = await client<GetDeploymentsForStackQueryResponse>({ method: "get", url: `/api/Stacks/${id}/deployments`, baseURL: "http://[::]:8080", ...options });
    return res.data;
}