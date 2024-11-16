import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from "../types/GetProjects.ts";

 /**
 * @link /api/Projects
 */
export async function getProjects(params?: GetProjectsQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectsQueryResponse, Error, unknown>({ method: "GET", url: `/api/Projects`, params, ...config });
    return res.data;
}