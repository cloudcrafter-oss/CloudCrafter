import { entityHealthDtoSchema } from "./entityHealthDtoSchema";
import { z } from "zod";

 export const deployedStackDtoSchema = z.object({ "stackId": z.string().uuid(), "name": z.string(), "health": z.lazy(() => entityHealthDtoSchema) });