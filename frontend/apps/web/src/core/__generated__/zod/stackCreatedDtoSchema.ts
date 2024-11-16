import { z } from "zod";

 export const stackCreatedDtoSchema = z.object({ "id": z.string().uuid() });