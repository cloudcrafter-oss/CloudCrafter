import type { GitProviderRepositoryDto } from "./GitProviderRepositoryDto";

 export type GetGitRepositoriesPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type GetGitRepositories200 = GitProviderRepositoryDto[];

 export type GetGitRepositoriesQueryResponse = GetGitRepositories200;

 export type GetGitRepositoriesQuery = {
    Response: GetGitRepositories200;
    PathParams: GetGitRepositoriesPathParams;
    Errors: any;
};