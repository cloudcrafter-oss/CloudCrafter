import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetProjectQueryResponse, GetProjectPathParams, GetProject404 } from "../types/GetProject";

 /**
 * {@link /api/Projects/:id}
 */
export async function getProject(id: GetProjectPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectQueryResponse, GetProject404, unknown>({ method: "GET", url: `/api/Projects/${id}`, ...config });
    return res.data;
}