import type { ProviderOverviewDto } from "./ProviderOverviewDto";

 /**
 * @description OK
*/
export type GetProviders200 = ProviderOverviewDto;
/**
 * @description OK
*/
export type GetProvidersQueryResponse = ProviderOverviewDto;
export type GetProvidersQuery = {
    Response: GetProvidersQueryResponse;
};