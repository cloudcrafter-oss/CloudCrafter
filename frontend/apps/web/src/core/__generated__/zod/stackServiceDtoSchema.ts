import { stackHealthStatusSchema } from "./stackHealthStatusSchema";
import { z } from "zod";


export const stackServiceDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string(), "healthStatus": z.lazy(() => stackHealthStatusSchema) });