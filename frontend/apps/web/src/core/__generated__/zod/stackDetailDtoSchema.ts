import { entityHealthDtoSchema } from "./entityHealthDtoSchema.ts";
import { stackServerDtoSchema } from "./stackServerDtoSchema.ts";
import { stackServiceDtoSchema } from "./stackServiceDtoSchema.ts";
import { stackSourceDtoSchema } from "./stackSourceDtoSchema.ts";
import { z } from "zod";

 export const stackDetailDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string(), "description": z.string().nullable(), "services": z.array(z.lazy(() => stackServiceDtoSchema)), "source": z.lazy(() => stackSourceDtoSchema).nullable(), "destination": z.lazy(() => stackServerDtoSchema), "health": z.lazy(() => entityHealthDtoSchema) });