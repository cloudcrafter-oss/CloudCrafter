import { z } from "zod";


export const tokenDtoSchema = z.object({ "accessToken": z.string(), "refreshToken": z.string(), "validTo": z.string().datetime(), "expiresIn": z.number().int() });