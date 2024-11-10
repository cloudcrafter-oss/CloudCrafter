import { z } from "zod";
import { stackDetailDtoSchema } from "./stackDetailDtoSchema";
import { updateStackCommandCommandSchema } from "./updateStackCommandCommandSchema";


export const updateStackPathParamsSchema = z.object({ "id": z.string().uuid() });
/**
 * @description OK
 */
export const updateStack200Schema = z.lazy(() => stackDetailDtoSchema);
/**
 * @description Not Found
 */
export const updateStack404Schema = z.any();

 export const updateStackMutationRequestSchema = z.lazy(() => updateStackCommandCommandSchema);
/**
 * @description OK
 */
export const updateStackMutationResponseSchema = z.lazy(() => stackDetailDtoSchema);