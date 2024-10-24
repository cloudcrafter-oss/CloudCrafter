import type { DeploymentLogDto } from "./DeploymentLogDto";

 export type GetDeploymentLogsPathParams = {
    /**
     * @type string, uuid
    */
    deploymentId: string;
};
/**
 * @description OK
*/
export type GetDeploymentLogs200 = DeploymentLogDto[];
/**
 * @description OK
*/
export type GetDeploymentLogsQueryResponse = DeploymentLogDto[];
export type GetDeploymentLogsQuery = {
    Response: GetDeploymentLogsQueryResponse;
    PathParams: GetDeploymentLogsPathParams;
};