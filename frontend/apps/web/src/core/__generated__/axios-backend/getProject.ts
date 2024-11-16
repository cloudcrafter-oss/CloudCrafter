import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetProjectQueryResponse, GetProjectPathParams, GetProject404 } from "../types/GetProject.ts";

 /**
 * @link /api/Projects/:id
 */
export async function getProject(id: GetProjectPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectQueryResponse, GetProject404, unknown>({ method: "GET", url: `/api/Projects/${id}`, ...config });
    return res.data;
}