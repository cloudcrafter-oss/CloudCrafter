import { z } from "zod";

 export const gitSettingsSchema = z.object({ "gitRepository": z.string().nullable(), "gitPath": z.string().nullable(), "gitBranch": z.string().nullable() }).nullable();