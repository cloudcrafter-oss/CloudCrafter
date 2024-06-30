import { ErrorResponse } from "./ErrorResponse";
import { CreateContributorRequest } from "./CreateContributorRequest";
import type { CreateContributorResponse } from "./CreateContributorResponse";

 /**
 * @description Success
*/
export type CloudCrafterWebContributorsCreate200 = CreateContributorResponse;
/**
 * @description Bad Request
*/
export type CloudCrafterWebContributorsCreate400 = ErrorResponse;
export type CloudCrafterWebContributorsCreateMutationRequest = CreateContributorRequest;
/**
 * @description Success
*/
export type CloudCrafterWebContributorsCreateMutationResponse = CreateContributorResponse;
export type CloudCrafterWebContributorsCreateMutation = {
    Response: CloudCrafterWebContributorsCreateMutationResponse;
    Request: CloudCrafterWebContributorsCreateMutationRequest;
    Errors: CloudCrafterWebContributorsCreate400;
};