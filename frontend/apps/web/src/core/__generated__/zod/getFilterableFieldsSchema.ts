import { z } from "zod";

 /**
 * @description OK
 */
export const getFilterableFields200Schema = z.object({}).catchall(z.array(z.string()));

 export const getFilterableFieldsQueryResponseSchema = z.lazy(() => getFilterableFields200Schema);