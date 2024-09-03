import { z } from "zod";
import { projectEnvironmentEnhancedDtoSchema } from "./projectEnvironmentEnhancedDtoSchema";


export const getProjectEnvironmentEnhancedPathParamsSchema = z.object({ "id": z.string().uuid(), "environmentId": z.string().uuid() });
/**
 * @description OK
 */
export const getProjectEnvironmentEnhanced200Schema = z.lazy(() => projectEnvironmentEnhancedDtoSchema);
/**
 * @description Not Found
 */
export const getProjectEnvironmentEnhanced404Schema = z.any();
/**
 * @description OK
 */
export const getProjectEnvironmentEnhancedQueryResponseSchema = z.lazy(() => projectEnvironmentEnhancedDtoSchema);