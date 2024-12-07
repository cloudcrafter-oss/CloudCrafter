import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetProjectsQueryResponse, GetProjectsQueryParams } from "../types/GetProjects";

 /**
 * {@link /api/Projects}
 */
export async function getProjects(params?: GetProjectsQueryParams, config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectsQueryResponse, Error, unknown>({ method: "GET", url: `/api/Projects`, params, ...config });
    return res.data;
}