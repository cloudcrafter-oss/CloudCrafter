import { ErrorResponse } from "./ErrorResponse";

 export type CloudCrafterWebContributorsDeletePathParams = {
    /**
     * @type integer, int32
    */
    contributorId: number;
};
/**
 * @description Success
*/
export type CloudCrafterWebContributorsDelete200 = any;
/**
 * @description Bad Request
*/
export type CloudCrafterWebContributorsDelete400 = ErrorResponse;
/**
 * @description Success
*/
export type CloudCrafterWebContributorsDeleteMutationResponse = any;
export type CloudCrafterWebContributorsDeleteMutation = {
    Response: CloudCrafterWebContributorsDeleteMutationResponse;
    PathParams: CloudCrafterWebContributorsDeletePathParams;
    Errors: CloudCrafterWebContributorsDelete400;
};