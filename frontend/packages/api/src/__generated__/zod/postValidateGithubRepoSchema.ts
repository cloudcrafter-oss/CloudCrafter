import { checkValidGitRepoCommandCommandSchema } from "./checkValidGitRepoCommandCommandSchema";
import { gitRepositoryCheckResultDtoSchema } from "./gitRepositoryCheckResultDtoSchema";
import { z } from "zod";

 /**
 * @description OK
 */
export const postValidateGithubRepo200Schema = z.lazy(() => gitRepositoryCheckResultDtoSchema);

 export const postValidateGithubRepoMutationRequestSchema = z.lazy(() => checkValidGitRepoCommandCommandSchema);

 export const postValidateGithubRepoMutationResponseSchema = z.lazy(() => postValidateGithubRepo200Schema);