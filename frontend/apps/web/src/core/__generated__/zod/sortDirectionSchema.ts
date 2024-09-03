import { z } from "zod";


export const sortDirectionSchema = z.union([z.literal(0), z.literal(1)]);