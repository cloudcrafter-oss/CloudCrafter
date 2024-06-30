import { z } from "zod";


export const postLoginUserQuerySchema = z.object({ "email": z.string().optional(), "password": z.string().optional() });