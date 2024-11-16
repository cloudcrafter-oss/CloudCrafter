import type { CheckValidGitRepoCommandCommand } from "./CheckValidGitRepoCommandCommand.ts";
import type { GitRepositoryCheckResultDto } from "./GitRepositoryCheckResultDto.ts";

 /**
 * @description OK
*/
export type PostValidateGithubRepo200 = GitRepositoryCheckResultDto;

 export type PostValidateGithubRepoMutationRequest = CheckValidGitRepoCommandCommand;

 export type PostValidateGithubRepoMutationResponse = PostValidateGithubRepo200;

 export type PostValidateGithubRepoMutation = {
    Response: PostValidateGithubRepo200;
    Request: PostValidateGithubRepoMutationRequest;
    Errors: any;
};