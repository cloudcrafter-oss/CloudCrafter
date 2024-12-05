import type { SimpleDeploymentDto } from "./SimpleDeploymentDto";

 export type GetDeploymentsForStackPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type GetDeploymentsForStack200 = SimpleDeploymentDto[];

 export type GetDeploymentsForStackQueryResponse = GetDeploymentsForStack200;

 export type GetDeploymentsForStackQuery = {
    Response: GetDeploymentsForStack200;
    PathParams: GetDeploymentsForStackPathParams;
    Errors: any;
};