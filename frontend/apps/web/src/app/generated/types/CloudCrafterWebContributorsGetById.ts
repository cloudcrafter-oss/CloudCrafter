import { ErrorResponse } from './ErrorResponse'
import type { ContributorRecord } from './ContributorRecord'

 export type CloudCrafterWebContributorsGetByIdPathParams = {
    /**
     * @type integer, int32
    */
    contributorId: number;
};
/**
 * @description Success
*/
export type CloudCrafterWebContributorsGetById200 = ContributorRecord;
/**
 * @description Bad Request
*/
export type CloudCrafterWebContributorsGetById400 = ErrorResponse;
/**
 * @description Success
*/
export type CloudCrafterWebContributorsGetByIdQueryResponse = ContributorRecord;
export type CloudCrafterWebContributorsGetByIdQuery = {
    Response: CloudCrafterWebContributorsGetByIdQueryResponse;
    PathParams: CloudCrafterWebContributorsGetByIdPathParams;
    Errors: CloudCrafterWebContributorsGetById400;
};