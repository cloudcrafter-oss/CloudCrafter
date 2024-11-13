import { entityHealthDtoSchema } from "./entityHealthDtoSchema";
import { z } from "zod";


export const stackServiceDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string(), "description": z.string().nullable().nullish(), "health": z.lazy(() => entityHealthDtoSchema) });