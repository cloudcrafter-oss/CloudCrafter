import { z } from "zod";


export const sortDirectionSchema = z.number().int().default(1);