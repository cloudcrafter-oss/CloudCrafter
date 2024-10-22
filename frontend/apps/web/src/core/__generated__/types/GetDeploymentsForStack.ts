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
/**
 * @description OK
*/
export type GetDeploymentsForStackQueryResponse = SimpleDeploymentDto[];
export type GetDeploymentsForStackQuery = {
    Response: GetDeploymentsForStackQueryResponse;
    PathParams: GetDeploymentsForStackPathParams;
};