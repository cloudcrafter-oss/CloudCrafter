import type { ProviderOverviewDto } from "./ProviderOverviewDto";

 export type GetProvidersQueryParams = {
    /**
     * @type boolean | undefined
    */
    IsActive?: boolean;
};

 /**
 * @description OK
*/
export type GetProviders200 = ProviderOverviewDto;

 export type GetProvidersQueryResponse = GetProviders200;

 export type GetProvidersQuery = {
    Response: GetProviders200;
    QueryParams: GetProvidersQueryParams;
    Errors: any;
};