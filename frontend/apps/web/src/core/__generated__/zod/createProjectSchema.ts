import { z } from "zod";
import { projectDtoSchema } from "./projectDtoSchema";
import { createProjectCommandCommandSchema } from "./createProjectCommandCommandSchema";

 /**
 * @description OK
 */
export const createProject200Schema = z.lazy(() => projectDtoSchema);

 export const createProjectMutationRequestSchema = z.lazy(() => createProjectCommandCommandSchema);
/**
 * @description OK
 */
export const createProjectMutationResponseSchema = z.lazy(() => projectDtoSchema);