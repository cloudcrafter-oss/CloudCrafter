import { z } from "zod";

 export const userDtoSchema = z.object({ "id": z.string().uuid(), "email": z.string(), "createdAt": z.string().datetime(), "fullName": z.string() });