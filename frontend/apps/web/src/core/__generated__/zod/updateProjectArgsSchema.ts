import { z } from "zod";


export const updateProjectArgsSchema = z.object({ "name": z.string().nullable().nullish(), "description": z.string().nullable().nullish() });