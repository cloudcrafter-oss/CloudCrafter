import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from "../types/GetDeploymentLogs.ts";

 /**
 * @link /api/Stacks/deployments/:deploymentId/logs
 */
export async function getDeploymentLogs(deploymentId: GetDeploymentLogsPathParams["deploymentId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetDeploymentLogsQueryResponse, Error, unknown>({ method: "GET", url: `/api/Stacks/deployments/${deploymentId}/logs`, ...config });
    return res.data;
}