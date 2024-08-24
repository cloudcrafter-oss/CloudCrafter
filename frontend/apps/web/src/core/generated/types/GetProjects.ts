import type { ProjectDto } from './ProjectDto'

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
/**
 * @description OK
*/
export type GetProjectsQueryResponse = ProjectDto[];
export type GetProjectsQuery = {
    Response: GetProjectsQueryResponse;
    QueryParams: GetProjectsQueryParams;
};