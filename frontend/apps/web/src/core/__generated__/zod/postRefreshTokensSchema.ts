import { postRefreshUserTokensQuerySchema } from "./postRefreshUserTokensQuerySchema.ts";
import { tokenDto2Schema } from "./tokenDto2Schema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const postRefreshTokens200Schema = z.lazy(() => tokenDto2Schema);

 export const postRefreshTokensMutationRequestSchema = z.lazy(() => postRefreshUserTokensQuerySchema);

 export const postRefreshTokensMutationResponseSchema = z.lazy(() => postRefreshTokens200Schema);