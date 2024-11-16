import { postCreateUserQuerySchema } from "./postCreateUserQuerySchema.ts";
import { tokenDtoSchema } from "./tokenDtoSchema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const postCreateUser200Schema = z.lazy(() => tokenDtoSchema);

 export const postCreateUserMutationRequestSchema = z.lazy(() => postCreateUserQuerySchema);

 export const postCreateUserMutationResponseSchema = z.lazy(() => postCreateUser200Schema);