import { ErrorResponse } from "./ErrorResponse";
import { UpdateContributorRequest } from "./UpdateContributorRequest";
import type { UpdateContributorResponse } from "./UpdateContributorResponse";

 export type CloudCrafterWebContributorsUpdatePathParams = {
    /**
     * @type integer, int32
    */
    contributorId: number;
};
/**
 * @description Success
*/
export type CloudCrafterWebContributorsUpdate200 = UpdateContributorResponse;
/**
 * @description Bad Request
*/
export type CloudCrafterWebContributorsUpdate400 = ErrorResponse;
export type CloudCrafterWebContributorsUpdateMutationRequest = UpdateContributorRequest;
/**
 * @description Success
*/
export type CloudCrafterWebContributorsUpdateMutationResponse = UpdateContributorResponse;
export type CloudCrafterWebContributorsUpdateMutation = {
    Response: CloudCrafterWebContributorsUpdateMutationResponse;
    Request: CloudCrafterWebContributorsUpdateMutationRequest;
    PathParams: CloudCrafterWebContributorsUpdatePathParams;
    Errors: CloudCrafterWebContributorsUpdate400;
};