import { projectDtoSchema } from "./projectDtoSchema.ts";
import { z } from "zod";

 export const getProjectPathParamsSchema = z.object({ "id": z.string().uuid() });

 /**
 * @description OK
 */
export const getProject200Schema = z.lazy(() => projectDtoSchema);

 /**
 * @description Not Found
 */
export const getProject404Schema = z.any();

 export const getProjectQueryResponseSchema = z.lazy(() => getProject200Schema);