import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { UpdateStackMutationRequest, UpdateStackMutationResponse, UpdateStackPathParams, UpdateStack404 } from "../types/UpdateStack.ts";

 /**
 * @link /api/Stacks/:id
 */
export async function updateStack(id: UpdateStackPathParams["id"], data: UpdateStackMutationRequest, config: Partial<RequestConfig<UpdateStackMutationRequest>> = {}) {
    const res = await client<UpdateStackMutationResponse, UpdateStack404, UpdateStackMutationRequest>({ method: "PUT", url: `/api/Stacks/${id}`, data, ...config });
    return res.data;
}