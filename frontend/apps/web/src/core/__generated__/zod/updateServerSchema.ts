import { updateServerDtoSchema } from "./updateServerDtoSchema.ts";
import { z } from "zod";

 export const updateServerPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const updateServer200Schema = z.any();

 export const updateServerMutationRequestSchema = z.lazy(() => updateServerDtoSchema);

 export const updateServerMutationResponseSchema = z.lazy(() => updateServer200Schema);