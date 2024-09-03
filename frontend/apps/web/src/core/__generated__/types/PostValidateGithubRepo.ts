import type { GitRepositoryCheckResultDto } from "./GitRepositoryCheckResultDto";
import type { CheckValidGitRepoCommandCommand } from "./CheckValidGitRepoCommandCommand";

 /**
 * @description OK
*/
export type PostValidateGithubRepo200 = GitRepositoryCheckResultDto;
export type PostValidateGithubRepoMutationRequest = CheckValidGitRepoCommandCommand;
/**
 * @description OK
*/
export type PostValidateGithubRepoMutationResponse = GitRepositoryCheckResultDto;
export type PostValidateGithubRepoMutation = {
    Response: PostValidateGithubRepoMutationResponse;
    Request: PostValidateGithubRepoMutationRequest;
};