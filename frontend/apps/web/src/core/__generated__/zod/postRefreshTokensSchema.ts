import { postRefreshUserTokensQuerySchema } from "./postRefreshUserTokensQuerySchema.ts";
import { tokenDtoSchema } from "./tokenDtoSchema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const postRefreshTokens200Schema = z.lazy(() => tokenDtoSchema);

 export const postRefreshTokensMutationRequestSchema = z.lazy(() => postRefreshUserTokensQuerySchema);

 export const postRefreshTokensMutationResponseSchema = z.lazy(() => postRefreshTokens200Schema);