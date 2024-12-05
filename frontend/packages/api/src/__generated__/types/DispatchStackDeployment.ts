import type { DeploymentCreatedDetailsDto } from "./DeploymentCreatedDetailsDto";

 export type DispatchStackDeploymentPathParams = {
    /**
     * @type string, uuid
    */
    id: string;
};

 /**
 * @description OK
*/
export type DispatchStackDeployment200 = DeploymentCreatedDetailsDto;

 export type DispatchStackDeploymentMutationResponse = DispatchStackDeployment200;

 export type DispatchStackDeploymentMutation = {
    Response: DispatchStackDeployment200;
    PathParams: DispatchStackDeploymentPathParams;
    Errors: any;
};