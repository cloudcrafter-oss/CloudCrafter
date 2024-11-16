import { z } from "zod";

 export const sortDirection2Schema = z.number().int().default(1);