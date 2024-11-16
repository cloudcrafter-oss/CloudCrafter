import { z } from "zod";

 export const stackServerDtoSchema = z.object({ "name": z.string(), "ipAddress": z.string() });