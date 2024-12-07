import { z } from "zod";

 export const environmentDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string() });