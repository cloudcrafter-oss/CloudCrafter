import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { CreateProjectMutationRequest, CreateProjectMutationResponse } from "../types/CreateProject";

 /**
 * @link /api/Projects
 */
export async function createProject(data: CreateProjectMutationRequest, config: Partial<RequestConfig<CreateProjectMutationRequest>> = {}) {
    const res = await client<CreateProjectMutationResponse, Error, CreateProjectMutationRequest>({ method: "POST", url: `/api/Projects`, data, ...config });
    return res.data;
}