import { projectDtoSchema } from "./projectDtoSchema.ts";
import { updateProjectArgsSchema } from "./updateProjectArgsSchema.ts";
import { z } from "zod";

 export const updateProjectPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const updateProject200Schema = z.lazy(() => projectDtoSchema);

 export const updateProjectMutationRequestSchema = z.lazy(() => updateProjectArgsSchema);

 export const updateProjectMutationResponseSchema = z.lazy(() => updateProject200Schema);