import { projectEnvironmentEnhancedDtoSchema } from "./projectEnvironmentEnhancedDtoSchema.ts";
import { z } from "zod";

 export const getProjectEnvironmentEnhancedPathParamsSchema = z.object({ "id": z.string().uuid(), "environmentId": z.string().uuid() });

 /**
 * @description OK
 */
export const getProjectEnvironmentEnhanced200Schema = z.lazy(() => projectEnvironmentEnhancedDtoSchema);

 /**
 * @description Not Found
 */
export const getProjectEnvironmentEnhanced404Schema = z.any();

 export const getProjectEnvironmentEnhancedQueryResponseSchema = z.lazy(() => getProjectEnvironmentEnhanced200Schema);