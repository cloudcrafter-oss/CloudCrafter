import { createStackCommandCommandSchema } from "./createStackCommandCommandSchema.ts";
import { stackCreatedDtoSchema } from "./stackCreatedDtoSchema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const postCreateStack200Schema = z.lazy(() => stackCreatedDtoSchema);

 export const postCreateStackMutationRequestSchema = z.lazy(() => createStackCommandCommandSchema);

 export const postCreateStackMutationResponseSchema = z.lazy(() => postCreateStack200Schema);