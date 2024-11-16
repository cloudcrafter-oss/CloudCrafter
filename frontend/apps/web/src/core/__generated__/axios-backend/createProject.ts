import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { CreateProjectMutationRequest, CreateProjectMutationResponse } from "../types/CreateProject";

 /**
 * @link /api/Projects
 */
export async function createProject(data: CreateProjectMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<CreateProjectMutationResponse>["data"]> {
    const res = await client<CreateProjectMutationResponse, CreateProjectMutationRequest>({ method: "post", url: `/api/Projects`, baseURL: "http://[::]:8080", data, ...options });
    return res.data;
}