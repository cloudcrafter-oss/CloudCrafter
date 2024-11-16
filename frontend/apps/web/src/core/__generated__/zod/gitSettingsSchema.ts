import { z } from "zod";

 export const gitSettingsSchema = z.object({ "gitRepository": z.string().nullable().nullish(), "gitPath": z.string().nullable().nullish(), "gitBranch": z.string().nullable().nullish() });