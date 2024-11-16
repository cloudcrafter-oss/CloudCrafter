import { environmentDtoSchema } from "./environmentDtoSchema.ts";
import { z } from "zod";

 export const projectDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string(), "description": z.string().nullable(), "createdAt": z.string().datetime(), "updatedAt": z.string().datetime(), "environments": z.array(z.lazy(() => environmentDtoSchema)) });