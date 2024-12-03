import { serverPingDtoSchema } from "./serverPingDtoSchema.ts";
import { z } from "zod";

 export const serverDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string(), "ipAddress": z.string(), "pingData": z.lazy(() => serverPingDtoSchema) });