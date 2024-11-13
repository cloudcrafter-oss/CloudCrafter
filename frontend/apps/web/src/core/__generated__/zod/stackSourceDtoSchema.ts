import { stackSourceDtoTypeSchema } from "./stackSourceDtoTypeSchema";
import { z } from "zod";


export const stackSourceDtoSchema = z.object({ "type": z.lazy(() => stackSourceDtoTypeSchema), "gitRepository": z.string().nullable().nullish() });