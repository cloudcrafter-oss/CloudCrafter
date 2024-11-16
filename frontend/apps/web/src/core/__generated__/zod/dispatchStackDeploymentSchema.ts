import { deploymentCreatedDetailsDtoSchema } from "./deploymentCreatedDetailsDtoSchema.ts";
import { z } from "zod";

 export const dispatchStackDeploymentPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const dispatchStackDeployment200Schema = z.lazy(() => deploymentCreatedDetailsDtoSchema);

 export const dispatchStackDeploymentMutationResponseSchema = z.lazy(() => dispatchStackDeployment200Schema);