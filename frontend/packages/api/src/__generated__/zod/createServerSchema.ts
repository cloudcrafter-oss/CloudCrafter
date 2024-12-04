import { createdServerDtoSchema } from "./createdServerDtoSchema.ts";
import { createServerCommandCommandSchema } from "./createServerCommandCommandSchema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const createServer200Schema = z.lazy(() => createdServerDtoSchema);

 export const createServerMutationRequestSchema = z.lazy(() => createServerCommandCommandSchema);

 export const createServerMutationResponseSchema = z.lazy(() => createServer200Schema);