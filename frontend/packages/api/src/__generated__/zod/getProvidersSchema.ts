import { providerOverviewDtoSchema } from "./providerOverviewDtoSchema";
import { z } from "zod";

 export const getProvidersQueryParamsSchema = z.object({ "IsActive": z.boolean().optional() }).optional();

 /**
 * @description OK
 */
export const getProviders200Schema = z.lazy(() => providerOverviewDtoSchema);

 export const getProvidersQueryResponseSchema = z.lazy(() => getProviders200Schema);