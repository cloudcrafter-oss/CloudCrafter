import { z } from "zod";
import { gitRepositoryCheckResultDtoSchema } from "./gitRepositoryCheckResultDtoSchema";
import { checkValidGitRepoCommandCommandSchema } from "./checkValidGitRepoCommandCommandSchema";

 /**
 * @description OK
 */
export const postValidateGithubRepo200Schema = z.lazy(() => gitRepositoryCheckResultDtoSchema);

 export const postValidateGithubRepoMutationRequestSchema = z.lazy(() => checkValidGitRepoCommandCommandSchema);
/**
 * @description OK
 */
export const postValidateGithubRepoMutationResponseSchema = z.lazy(() => gitRepositoryCheckResultDtoSchema);