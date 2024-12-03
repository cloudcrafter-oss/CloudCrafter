import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { UpdateStackServiceMutationRequest, UpdateStackServiceMutationResponse, UpdateStackServicePathParams } from "../types/UpdateStackService.ts";

 /**
 * @link /api/Stacks/:stackId/services/:stackServiceId
 */
export async function updateStackService(stackId: UpdateStackServicePathParams["stackId"], stackServiceId: UpdateStackServicePathParams["stackServiceId"], data: UpdateStackServiceMutationRequest, config: Partial<RequestConfig<UpdateStackServiceMutationRequest>> = {}) {
    const res = await client<UpdateStackServiceMutationResponse, Error, UpdateStackServiceMutationRequest>({ method: "PATCH", url: `/api/Stacks/${stackId}/services/${stackServiceId}`, data, ...config });
    return res.data;
}