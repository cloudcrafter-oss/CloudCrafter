import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { DispatchStackDeploymentMutationResponse, DispatchStackDeploymentPathParams } from "../types/DispatchStackDeployment";

 /**
 * {@link /api/Stacks/:id/deploy}
 */
export async function dispatchStackDeployment(id: DispatchStackDeploymentPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<DispatchStackDeploymentMutationResponse, Error, unknown>({ method: "POST", url: `/api/Stacks/${id}/deploy`, ...config });
    return res.data;
}