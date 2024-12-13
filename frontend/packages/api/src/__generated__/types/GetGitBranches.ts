import type { GitProviderBranchDto } from "./GitProviderBranchDto";

 export type GetGitBranchesPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
    /**
     * @type string
    */
    repositoryId: string;
};

 /**
 * @description OK
*/
export type GetGitBranches200 = GitProviderBranchDto[];

 export type GetGitBranchesQueryResponse = GetGitBranches200;

 export type GetGitBranchesQuery = {
    Response: GetGitBranches200;
    PathParams: GetGitBranchesPathParams;
    Errors: any;
};