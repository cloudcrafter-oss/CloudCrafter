import { providerOverviewDtoSchema } from "./providerOverviewDtoSchema";
import { z } from "zod";

 /**
 * @description OK
 */
export const getProviders200Schema = z.lazy(() => providerOverviewDtoSchema);

 export const getProvidersQueryResponseSchema = z.lazy(() => getProviders200Schema);