import { deployedStackDtoSchema } from "./deployedStackDtoSchema";
import { z } from "zod";


export const projectEnvironmentEnhancedDtoSchema = z.object({ "environmentCreatedAt": z.string().datetime(), "deployedStackCount": z.number().int(), "lastDeploymentAt": z.string().datetime().nullable().nullish(), "environmentName": z.string(), "projectName": z.string(), "deployedStacks": z.array(z.lazy(() => deployedStackDtoSchema)) });