import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { DispatchStackDeploymentMutationResponse, DispatchStackDeploymentPathParams } from "../types/DispatchStackDeployment";

 /**
 * @link /api/Stacks/:id/deploy
 */
export async function dispatchStackDeployment(id: DispatchStackDeploymentPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DispatchStackDeploymentMutationResponse>["data"]> {
    const res = await client<DispatchStackDeploymentMutationResponse>({ method: "post", url: `/api/Stacks/${id}/deploy`, ...options });
    return res.data;
}