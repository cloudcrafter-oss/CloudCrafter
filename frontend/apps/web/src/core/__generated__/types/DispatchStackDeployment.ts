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
/**
 * @description OK
*/
export type DispatchStackDeploymentMutationResponse = DeploymentCreatedDetailsDto;
export type DispatchStackDeploymentMutation = {
    Response: DispatchStackDeploymentMutationResponse;
    PathParams: DispatchStackDeploymentPathParams;
};