import { entityHealthDtoValueSchema } from "./entityHealthDtoValueSchema.ts";
import { z } from "zod";

 export const entityHealthDtoSchema = z.object({ "statusAt": z.string().datetime().nullable().nullish(), "value": z.lazy(() => entityHealthDtoValueSchema) });