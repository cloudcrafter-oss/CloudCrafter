import type { ProjectEnvironmentEnhancedDto } from "./ProjectEnvironmentEnhancedDto.ts";

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

 export type GetProjectEnvironmentEnhancedQueryResponse = GetProjectEnvironmentEnhanced200;

 export type GetProjectEnvironmentEnhancedQuery = {
    Response: GetProjectEnvironmentEnhanced200;
    PathParams: GetProjectEnvironmentEnhancedPathParams;
    Errors: GetProjectEnvironmentEnhanced404;
};