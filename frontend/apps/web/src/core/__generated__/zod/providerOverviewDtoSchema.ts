import { simpleGithubProviderDtoSchema } from "./simpleGithubProviderDtoSchema";
import { z } from "zod";


export const providerOverviewDtoSchema = z.object({ "github": z.array(z.lazy(() => simpleGithubProviderDtoSchema)) });