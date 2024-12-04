import { stackSourceDtoTypeSchema } from "./stackSourceDtoTypeSchema.ts";
import { z } from "zod";

 export const stackSourceDtoSchema = z.object({ "type": z.lazy(() => stackSourceDtoTypeSchema), "gitRepository": z.string().nullable().nullish(), "gitPath": z.string().nullable().nullish(), "gitBranch": z.string().nullable().nullish() }).nullable();