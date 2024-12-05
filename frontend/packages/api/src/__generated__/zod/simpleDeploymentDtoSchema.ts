import { deploymentStatusDtoSchema } from "./deploymentStatusDtoSchema";
import { z } from "zod";

 export const simpleDeploymentDtoSchema = z.object({ "createdAt": z.string().datetime(), "updatedAt": z.string().datetime(), "id": z.string().uuid(), "state": z.lazy(() => deploymentStatusDtoSchema), "stackId": z.string().uuid(), "stackName": z.string(), "projectId": z.string().uuid(), "environmentId": z.string().uuid(), "description": z.string().nullable().nullish() });