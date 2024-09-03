import { z } from "zod";
import { deploymentCreatedDetailsDtoSchema } from "./deploymentCreatedDetailsDtoSchema";


export const dispatchStackDeploymentPathParamsSchema = z.object({ "id": z.string().uuid() });
/**
 * @description OK
 */
export const dispatchStackDeployment200Schema = z.lazy(() => deploymentCreatedDetailsDtoSchema);
/**
 * @description OK
 */
export const dispatchStackDeploymentMutationResponseSchema = z.lazy(() => deploymentCreatedDetailsDtoSchema);