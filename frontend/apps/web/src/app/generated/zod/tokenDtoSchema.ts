import { z } from "zod";


export const tokenDtoSchema = z.object({ "token": z.string().optional(), "validTo": z.string().datetime().optional() });