import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { UpdateProjectMutationRequest, UpdateProjectMutationResponse, UpdateProjectPathParams } from "../types/UpdateProject";

 /**
 * @link /api/Projects/:id
 */
export async function updateProject(id: UpdateProjectPathParams["id"], data?: UpdateProjectMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateProjectMutationResponse>["data"]> {
    const res = await client<UpdateProjectMutationResponse, UpdateProjectMutationRequest>({ method: "post", url: `/api/Projects/${id}`, baseURL: "http://[::]:8080", data, ...options });
    return res.data;
}