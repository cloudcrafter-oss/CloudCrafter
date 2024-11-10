import { z } from "zod";


export const updateStackCommandCommandSchema = z.object({ "stackId": z.string().uuid(), "name": z.string().nullable().nullish(), "description": z.string().nullable().nullish() });