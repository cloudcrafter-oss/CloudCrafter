import { entityHealthDtoSchema } from "./entityHealthDtoSchema.ts";
import { stackServiceHttpConfigurationDtoSchema } from "./stackServiceHttpConfigurationDtoSchema.ts";
import { z } from "zod";

 export const stackServiceDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string(), "description": z.string().nullable(), "httpConfiguration": z.lazy(() => stackServiceHttpConfigurationDtoSchema).nullable(), "health": z.lazy(() => entityHealthDtoSchema) });