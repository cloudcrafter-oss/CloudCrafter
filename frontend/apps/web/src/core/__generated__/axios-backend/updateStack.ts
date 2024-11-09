import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { UpdateStackMutationRequest, UpdateStackMutationResponse, UpdateStackPathParams } from "../types/UpdateStack";

 /**
 * @link /api/Stacks/:id
 */
export async function updateStack(id: UpdateStackPathParams["id"], data: UpdateStackMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateStackMutationResponse>["data"]> {
    const res = await client<UpdateStackMutationResponse, UpdateStackMutationRequest>({ method: "put", url: `/api/Stacks/${id}`, data, ...options });
    return res.data;
}