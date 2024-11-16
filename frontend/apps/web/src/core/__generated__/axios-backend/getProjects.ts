import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from "../types/GetProjects";

 /**
 * @link /api/Projects
 */
export async function getProjects(params?: GetProjectsQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetProjectsQueryResponse>["data"]> {
    const res = await client<GetProjectsQueryResponse>({ method: "get", url: `/api/Projects`, baseURL: "http://[::]:8080", params, ...options });
    return res.data;
}