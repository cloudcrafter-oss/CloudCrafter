import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { GetDeploymentLogsQueryResponse, GetDeploymentLogsPathParams } from "../types/GetDeploymentLogs";

 /**
 * @link /api/Stacks/deployments/:deploymentId/logs
 */
export async function getDeploymentLogs(deploymentId: GetDeploymentLogsPathParams["deploymentId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetDeploymentLogsQueryResponse>["data"]> {
    const res = await client<GetDeploymentLogsQueryResponse>({ method: "get", url: `/api/Stacks/deployments/${deploymentId}/logs`, ...options });
    return res.data;
}