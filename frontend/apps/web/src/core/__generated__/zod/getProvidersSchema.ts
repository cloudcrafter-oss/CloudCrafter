import { z } from "zod";
import { providerOverviewDtoSchema } from "./providerOverviewDtoSchema";

 /**
 * @description OK
 */
export const getProviders200Schema = z.lazy(() => providerOverviewDtoSchema);
/**
 * @description OK
 */
export const getProvidersQueryResponseSchema = z.lazy(() => providerOverviewDtoSchema);