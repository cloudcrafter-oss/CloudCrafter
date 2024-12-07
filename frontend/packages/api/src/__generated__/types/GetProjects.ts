import type { ProjectDto } from "./ProjectDto";

 export type GetProjectsQueryParams = {
    /**
     * @default false
     * @type boolean | undefined
    */
    includeEnvironments?: boolean;
};

 /**
 * @description OK
*/
export type GetProjects200 = ProjectDto[];

 export type GetProjectsQueryResponse = GetProjects200;

 export type GetProjectsQuery = {
    Response: GetProjects200;
    QueryParams: GetProjectsQueryParams;
    Errors: any;
};