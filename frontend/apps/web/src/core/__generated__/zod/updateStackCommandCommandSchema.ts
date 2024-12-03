import { gitSettingsSchema } from "./gitSettingsSchema.ts";
import { z } from "zod";

 export const updateStackCommandCommandSchema = z.object({ "stackId": z.string().uuid(), "name": z.string().nullable().nullish(), "description": z.string().nullable().nullish(), "gitSettings": z.lazy(() => gitSettingsSchema).optional().nullable() });