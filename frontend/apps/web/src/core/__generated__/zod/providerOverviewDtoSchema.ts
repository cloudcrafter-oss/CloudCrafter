import { simpleGithubProviderDtoSchema } from "./simpleGithubProviderDtoSchema.ts";
import { z } from "zod";

 export const providerOverviewDtoSchema = z.object({ "github": z.array(z.lazy(() => simpleGithubProviderDtoSchema)) });