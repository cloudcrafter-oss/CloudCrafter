import { z } from "zod";

 export const getTesterQueryParamsSchema = z.object({ "Page": z.number().int().optional() }).optional();

 /**
 * @description OK
 */
export const getTester200Schema = z.any();

 export const getTesterQueryResponseSchema = z.lazy(() => getTester200Schema);