import { z } from "zod";
import { createContributorResponseSchema } from "./createContributorResponseSchema";
import { errorResponseSchema } from "./errorResponseSchema";
import { createContributorRequestSchema } from "./createContributorRequestSchema";

 /**
 * @description Success
 */
export const cloudCrafterWebContributorsCreate200Schema = z.lazy(() => createContributorResponseSchema);
/**
 * @description Bad Request
 */
export const cloudCrafterWebContributorsCreate400Schema = z.lazy(() => errorResponseSchema);

 export const cloudCrafterWebContributorsCreateMutationRequestSchema = z.lazy(() => createContributorRequestSchema);
/**
 * @description Success
 */
export const cloudCrafterWebContributorsCreateMutationResponseSchema = z.lazy(() => createContributorResponseSchema);