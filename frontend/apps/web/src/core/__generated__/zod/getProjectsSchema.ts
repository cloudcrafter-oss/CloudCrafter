import { projectDtoSchema } from "./projectDtoSchema.ts";
import { z } from "zod";

 export const getProjectsQueryParamsSchema = z.object({ "includeEnvironments": z.boolean().default(false) }).optional();

 /**
 * @description OK
 */
export const getProjects200Schema = z.array(z.lazy(() => projectDtoSchema));

 export const getProjectsQueryResponseSchema = z.lazy(() => getProjects200Schema);