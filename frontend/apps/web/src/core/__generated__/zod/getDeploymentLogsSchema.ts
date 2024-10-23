import { z } from "zod";
import { deploymentLogDtoSchema } from "./deploymentLogDtoSchema";


export const getDeploymentLogsPathParamsSchema = z.object({ "deploymentId": z.string().uuid() });
/**
 * @description OK
 */
export const getDeploymentLogs200Schema = z.array(z.lazy(() => deploymentLogDtoSchema));
/**
 * @description OK
 */
export const getDeploymentLogsQueryResponseSchema = z.array(z.lazy(() => deploymentLogDtoSchema));