import { z } from "zod";

 /**
 * @description OK
 */
export const getFilterableFields200Schema = z.object({}).catchall(z.array(z.string()));
/**
 * @description OK
 */
export const getFilterableFieldsQueryResponseSchema = z.object({}).catchall(z.array(z.string()));