import { z } from "zod";

 export const gitProviderRepositoryDtoSchema = z.object({ "fullName": z.string(), "id": z.number().int() });