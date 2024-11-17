import { z } from "zod";

 export const createdServerDtoSchema = z.object({ "id": z.string().uuid() });