import { z } from "zod";


export const deploymentLogDtoSchema = z.object({ "message": z.string(), "isError": z.boolean(), "at": z.string().datetime() });