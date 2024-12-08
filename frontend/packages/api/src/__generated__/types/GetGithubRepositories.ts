import type { GitProviderRepositoryDto } from "./GitProviderRepositoryDto";

 export type GetGithubRepositoriesPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type GetGithubRepositories200 = GitProviderRepositoryDto[];

 export type GetGithubRepositoriesQueryResponse = GetGithubRepositories200;

 export type GetGithubRepositoriesQuery = {
    Response: GetGithubRepositories200;
    PathParams: GetGithubRepositoriesPathParams;
    Errors: any;
};