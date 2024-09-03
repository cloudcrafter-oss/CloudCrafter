import { stackSourceTypeSchema } from "./stackSourceTypeSchema";
import { z } from "zod";


export const stackSourceDtoSchema = z.object({ "type": z.lazy(() => stackSourceTypeSchema) });