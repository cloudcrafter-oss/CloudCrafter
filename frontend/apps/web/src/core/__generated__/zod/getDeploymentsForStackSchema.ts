import { z } from "zod";
import { simpleDeploymentDtoSchema } from "./simpleDeploymentDtoSchema";


export const getDeploymentsForStackPathParamsSchema = z.object({ "id": z.string().uuid() });
/**
 * @description OK
 */
export const getDeploymentsForStack200Schema = z.array(z.lazy(() => simpleDeploymentDtoSchema));
/**
 * @description OK
 */
export const getDeploymentsForStackQueryResponseSchema = z.array(z.lazy(() => simpleDeploymentDtoSchema));