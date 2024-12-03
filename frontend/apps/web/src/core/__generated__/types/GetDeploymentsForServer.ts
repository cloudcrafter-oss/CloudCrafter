import type { PaginatedListOfSimpleDeploymentDto } from "./PaginatedListOfSimpleDeploymentDto.ts";

 export type GetDeploymentsForServerPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 export type GetDeploymentsForServerQueryParams = {
    /**
     * @type integer | undefined, int32
    */
    Page?: number;
    /**
     * @type integer | undefined, int32
    */
    PageSize?: number;
};

 /**
 * @description OK
*/
export type GetDeploymentsForServer200 = PaginatedListOfSimpleDeploymentDto;

 export type GetDeploymentsForServerQueryResponse = GetDeploymentsForServer200;

 export type GetDeploymentsForServerQuery = {
    Response: GetDeploymentsForServer200;
    PathParams: GetDeploymentsForServerPathParams;
    QueryParams: GetDeploymentsForServerQueryParams;
    Errors: any;
};