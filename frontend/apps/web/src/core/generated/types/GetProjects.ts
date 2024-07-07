import type { ProjectDto } from './ProjectDto'

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
};