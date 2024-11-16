import { createGithubProviderCommandCommandSchema } from "./createGithubProviderCommandCommandSchema.ts";
import { z } from "zod";

 /**
 * @description Created
 */
export const postCreateGithubApp201Schema = z.any();

 /**
 * @description Bad Request
 */
export const postCreateGithubApp400Schema = z.any();

 export const postCreateGithubAppMutationRequestSchema = z.lazy(() => createGithubProviderCommandCommandSchema);

 export const postCreateGithubAppMutationResponseSchema = z.lazy(() => postCreateGithubApp201Schema);