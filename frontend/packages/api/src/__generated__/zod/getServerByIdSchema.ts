import { serverDetailDtoSchema } from "./serverDetailDtoSchema";
import { z } from "zod";

 export const getServerByIdPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const getServerById200Schema = z.lazy(() => serverDetailDtoSchema);

 export const getServerByIdQueryResponseSchema = z.lazy(() => getServerById200Schema);