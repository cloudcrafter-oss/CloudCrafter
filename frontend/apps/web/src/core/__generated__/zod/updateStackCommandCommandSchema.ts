import { gitSettingsSchema } from "./gitSettingsSchema.ts";
import { z } from "zod";

 export const updateStackCommandCommandSchema = z.object({ "stackId": z.string().uuid(), "name": z.string().default().nullable().nullish(), "description": z.string().default().nullable().nullish(), "gitSettings": z.lazy(() => gitSettingsSchema).optional() });