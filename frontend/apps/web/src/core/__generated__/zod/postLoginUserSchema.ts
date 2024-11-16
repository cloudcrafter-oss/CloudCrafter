import { postLoginUserQuerySchema } from "./postLoginUserQuerySchema.ts";
import { tokenDtoSchema } from "./tokenDtoSchema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const postLoginUser200Schema = z.lazy(() => tokenDtoSchema);

 export const postLoginUserMutationRequestSchema = z.lazy(() => postLoginUserQuerySchema);

 export const postLoginUserMutationResponseSchema = z.lazy(() => postLoginUser200Schema);