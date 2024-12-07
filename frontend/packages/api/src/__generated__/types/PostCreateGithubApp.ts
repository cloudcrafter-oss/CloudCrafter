import type { CreateGithubProviderCommandCommand } from "./CreateGithubProviderCommandCommand";

 /**
 * @description Created
*/
export type PostCreateGithubApp201 = any;

 /**
 * @description Bad Request
*/
export type PostCreateGithubApp400 = any;

 export type PostCreateGithubAppMutationRequest = CreateGithubProviderCommandCommand;

 export type PostCreateGithubAppMutationResponse = PostCreateGithubApp201;

 export type PostCreateGithubAppMutation = {
    Response: PostCreateGithubApp201;
    Request: PostCreateGithubAppMutationRequest;
    Errors: PostCreateGithubApp400;
};