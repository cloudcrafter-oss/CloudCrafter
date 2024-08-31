import type { ProjectEnvironmentEnhancedDto } from './ProjectEnvironmentEnhancedDto'

 export type GetProjectEnvironmentEnhancedPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
    /**
     * @type string, uuid
    */
    environmentId: string;
};
/**
 * @description OK
*/
export type GetProjectEnvironmentEnhanced200 = ProjectEnvironmentEnhancedDto;
/**
 * @description Not Found
*/
export type GetProjectEnvironmentEnhanced404 = any;
/**
 * @description OK
*/
export type GetProjectEnvironmentEnhancedQueryResponse = ProjectEnvironmentEnhancedDto;
export type GetProjectEnvironmentEnhancedQuery = {
    Response: GetProjectEnvironmentEnhancedQueryResponse;
    PathParams: GetProjectEnvironmentEnhancedPathParams;
    Errors: GetProjectEnvironmentEnhanced404;
};