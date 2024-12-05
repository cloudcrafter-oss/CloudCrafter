import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { DeleteProjectMutationResponse, DeleteProjectPathParams } from "../types/DeleteProject";

 /**
 * @link /api/Projects/:id
 */
export async function deleteProject(id: DeleteProjectPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<DeleteProjectMutationResponse, Error, unknown>({ method: "DELETE", url: `/api/Projects/${id}`, ...config });
    return res.data;
}