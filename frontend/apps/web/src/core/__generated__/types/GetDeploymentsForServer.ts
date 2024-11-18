import type { SimpleDeploymentDto } from "./SimpleDeploymentDto.ts";

 export type GetDeploymentsForServerPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type GetDeploymentsForServer200 = SimpleDeploymentDto[];

 export type GetDeploymentsForServerQueryResponse = GetDeploymentsForServer200;

 export type GetDeploymentsForServerQuery = {
    Response: GetDeploymentsForServer200;
    PathParams: GetDeploymentsForServerPathParams;
    Errors: any;
};