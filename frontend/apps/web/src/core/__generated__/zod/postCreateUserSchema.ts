import { postCreateUserQuerySchema } from "./postCreateUserQuerySchema.ts";
import { tokenDto2Schema } from "./tokenDto2Schema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const postCreateUser200Schema = z.lazy(() => tokenDto2Schema);

 export const postCreateUserMutationRequestSchema = z.lazy(() => postCreateUserQuerySchema);

 export const postCreateUserMutationResponseSchema = z.lazy(() => postCreateUser200Schema);