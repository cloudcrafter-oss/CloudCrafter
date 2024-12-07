import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhancedPathParams, GetProjectEnvironmentEnhanced404 } from "../types/GetProjectEnvironmentEnhanced";

 /**
 * {@link /api/Projects/:id/:environmentId}
 */
export async function getProjectEnvironmentEnhanced(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhanced404, unknown>({ method: "GET", url: `/api/Projects/${id}/${environmentId}`, ...config });
    return res.data;
}