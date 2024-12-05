import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { UpdateProjectMutationRequest, UpdateProjectMutationResponse, UpdateProjectPathParams } from "../types/UpdateProject";

 /**
 * @link /api/Projects/:id
 */
export async function updateProject(id: UpdateProjectPathParams["id"], data?: UpdateProjectMutationRequest, config: Partial<RequestConfig<UpdateProjectMutationRequest>> = {}) {
    const res = await client<UpdateProjectMutationResponse, Error, UpdateProjectMutationRequest>({ method: "POST", url: `/api/Projects/${id}`, data, ...config });
    return res.data;
}