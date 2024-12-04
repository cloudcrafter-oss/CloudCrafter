import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { DispatchStackDeploymentMutationResponse, DispatchStackDeploymentPathParams } from "../types/DispatchStackDeployment.ts";

 /**
 * @link /api/Stacks/:id/deploy
 */
export async function dispatchStackDeployment(id: DispatchStackDeploymentPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<DispatchStackDeploymentMutationResponse, Error, unknown>({ method: "POST", url: `/api/Stacks/${id}/deploy`, ...config });
    return res.data;
}