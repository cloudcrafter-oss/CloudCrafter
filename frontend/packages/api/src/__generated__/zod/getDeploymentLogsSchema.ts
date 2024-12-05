import { deploymentLogDtoSchema } from "./deploymentLogDtoSchema";
import { z } from "zod";

 export const getDeploymentLogsPathParamsSchema = z.object({ "deploymentId": z.string().uuid() });

 /**
 * @description OK
 */
export const getDeploymentLogs200Schema = z.array(z.lazy(() => deploymentLogDtoSchema));

 export const getDeploymentLogsQueryResponseSchema = z.lazy(() => getDeploymentLogs200Schema);