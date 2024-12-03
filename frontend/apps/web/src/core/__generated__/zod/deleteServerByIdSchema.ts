import { z } from "zod";

 export const deleteServerByIdPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const deleteServerById200Schema = z.any();

 export const deleteServerByIdMutationResponseSchema = z.lazy(() => deleteServerById200Schema);