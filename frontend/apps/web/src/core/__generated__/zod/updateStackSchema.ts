import { stackDetailDtoSchema } from "./stackDetailDtoSchema.ts";
import { updateStackCommandCommand2Schema } from "./updateStackCommandCommand2Schema.ts";
import { z } from "zod";

 export const updateStackPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const updateStack200Schema = z.lazy(() => stackDetailDtoSchema);

 /**
 * @description Not Found
 */
export const updateStack404Schema = z.any();

 export const updateStackMutationRequestSchema = z.lazy(() => updateStackCommandCommand2Schema);

 export const updateStackMutationResponseSchema = z.lazy(() => updateStack200Schema);