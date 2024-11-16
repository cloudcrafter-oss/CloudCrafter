import { z } from "zod";

 export const tokenDto2Schema = z.object({ "accessToken": z.string(), "refreshToken": z.string(), "validTo": z.string().datetime(), "expiresIn": z.number().int() });