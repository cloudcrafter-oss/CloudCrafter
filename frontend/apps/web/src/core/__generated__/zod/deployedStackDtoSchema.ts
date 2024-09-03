import { projectHealthStatusSchema } from "./projectHealthStatusSchema";
import { z } from "zod";


export const deployedStackDtoSchema = z.object({ "stackId": z.string().uuid(), "name": z.string(), "healthStatus": z.lazy(() => projectHealthStatusSchema) });