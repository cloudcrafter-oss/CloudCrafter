import { z } from "zod";


export const simpleGithubProviderDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string() });