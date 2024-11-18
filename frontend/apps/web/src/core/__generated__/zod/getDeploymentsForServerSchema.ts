import { simpleDeploymentDtoSchema } from "./simpleDeploymentDtoSchema.ts";
import { z } from "zod";

 export const getDeploymentsForServerPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const getDeploymentsForServer200Schema = z.array(z.lazy(() => simpleDeploymentDtoSchema));

 export const getDeploymentsForServerQueryResponseSchema = z.lazy(() => getDeploymentsForServer200Schema);