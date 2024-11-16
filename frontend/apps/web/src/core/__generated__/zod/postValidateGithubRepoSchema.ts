import { checkValidGitRepoCommandCommandSchema } from "./checkValidGitRepoCommandCommandSchema.ts";
import { gitRepositoryCheckResultDtoSchema } from "./gitRepositoryCheckResultDtoSchema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const postValidateGithubRepo200Schema = z.lazy(() => gitRepositoryCheckResultDtoSchema);

 export const postValidateGithubRepoMutationRequestSchema = z.lazy(() => checkValidGitRepoCommandCommandSchema);

 export const postValidateGithubRepoMutationResponseSchema = z.lazy(() => postValidateGithubRepo200Schema);