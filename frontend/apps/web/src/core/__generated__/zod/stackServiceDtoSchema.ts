import { entityHealthDtoSchema } from "./entityHealthDtoSchema.ts";
import { z } from "zod";

 export const stackServiceDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string(), "description": z.string().nullable(), "health": z.lazy(() => entityHealthDtoSchema) });