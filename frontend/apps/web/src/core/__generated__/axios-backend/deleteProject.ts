import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { DeleteProjectMutationResponse, DeleteProjectPathParams } from "../types/DeleteProject";

 /**
 * @link /api/Projects/:id
 */
export async function deleteProject(id: DeleteProjectPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteProjectMutationResponse>["data"]> {
    const res = await client<DeleteProjectMutationResponse>({ method: "delete", url: `/api/Projects/${id}`, ...options });
    return res.data;
}