import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { CreateProjectMutationRequest, CreateProjectMutationResponse } from "../types/CreateProject.ts";

 /**
 * @link /api/Projects
 */
export async function createProject(data: CreateProjectMutationRequest, config: Partial<RequestConfig<CreateProjectMutationRequest>> = {}) {
    const res = await client<CreateProjectMutationResponse, Error, CreateProjectMutationRequest>({ method: "POST", url: `/api/Projects`, data, ...config });
    return res.data;
}