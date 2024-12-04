import type { ProjectDto } from "./ProjectDto.ts";

 export type GetProjectPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type GetProject200 = ProjectDto;

 /**
 * @description Not Found
*/
export type GetProject404 = any;

 export type GetProjectQueryResponse = GetProject200;

 export type GetProjectQuery = {
    Response: GetProject200;
    PathParams: GetProjectPathParams;
    Errors: GetProject404;
};