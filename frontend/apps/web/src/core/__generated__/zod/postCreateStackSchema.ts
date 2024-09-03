import { z } from "zod";
import { stackCreatedDtoSchema } from "./stackCreatedDtoSchema";
import { createStackCommandCommandSchema } from "./createStackCommandCommandSchema";

 /**
 * @description OK
 */
export const postCreateStack200Schema = z.lazy(() => stackCreatedDtoSchema);

 export const postCreateStackMutationRequestSchema = z.lazy(() => createStackCommandCommandSchema);
/**
 * @description OK
 */
export const postCreateStackMutationResponseSchema = z.lazy(() => stackCreatedDtoSchema);