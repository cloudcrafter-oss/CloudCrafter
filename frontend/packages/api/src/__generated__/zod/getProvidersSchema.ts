import { sourceProviderDtoSchema } from "./sourceProviderDtoSchema";
import { z } from "zod";

 export const getProvidersQueryParamsSchema = z.object({ "IsActive": z.boolean().optional() }).optional();

 /**
 * @description OK
 */
export const getProviders200Schema = z.array(z.lazy(() => sourceProviderDtoSchema));

 export const getProvidersQueryResponseSchema = z.lazy(() => getProviders200Schema);