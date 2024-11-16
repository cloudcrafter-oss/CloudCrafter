import { serverDtoSchema } from "./serverDtoSchema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const getServers200Schema = z.array(z.lazy(() => serverDtoSchema));

 export const getServersQueryResponseSchema = z.lazy(() => getServers200Schema);