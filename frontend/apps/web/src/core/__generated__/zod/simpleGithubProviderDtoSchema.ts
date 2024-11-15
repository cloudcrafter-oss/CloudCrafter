import { z } from "zod";


export const simpleGithubProviderDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string(), "isConnected": z.boolean().nullable().nullish(), "createdAt": z.string().datetime() });