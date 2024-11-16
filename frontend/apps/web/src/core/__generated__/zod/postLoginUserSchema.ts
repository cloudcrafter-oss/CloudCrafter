import { postLoginUserQuerySchema } from "./postLoginUserQuerySchema.ts";
import { tokenDto2Schema } from "./tokenDto2Schema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const postLoginUser200Schema = z.lazy(() => tokenDto2Schema);

 export const postLoginUserMutationRequestSchema = z.lazy(() => postLoginUserQuerySchema);

 export const postLoginUserMutationResponseSchema = z.lazy(() => postLoginUser200Schema);