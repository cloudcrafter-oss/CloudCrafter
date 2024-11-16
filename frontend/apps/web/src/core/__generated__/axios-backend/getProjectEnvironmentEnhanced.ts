import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { GetProjectEnvironmentEnhancedQueryResponse, GetProjectEnvironmentEnhancedPathParams } from "../types/GetProjectEnvironmentEnhanced";

 /**
 * @link /api/Projects/:id/:environmentId
 */
export async function getProjectEnvironmentEnhanced(id: GetProjectEnvironmentEnhancedPathParams["id"], environmentId: GetProjectEnvironmentEnhancedPathParams["environmentId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetProjectEnvironmentEnhancedQueryResponse>["data"]> {
    const res = await client<GetProjectEnvironmentEnhancedQueryResponse>({ method: "get", url: `/api/Projects/${id}/${environmentId}`, ...options });
    return res.data;
}