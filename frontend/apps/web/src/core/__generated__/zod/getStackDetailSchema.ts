import { z } from "zod";
import { stackDetailDtoSchema } from "./stackDetailDtoSchema";


export const getStackDetailPathParamsSchema = z.object({ "id": z.string().uuid() });
/**
 * @description OK
 */
export const getStackDetail200Schema = z.lazy(() => stackDetailDtoSchema);
/**
 * @description Not Found
 */
export const getStackDetail404Schema = z.any();
/**
 * @description OK
 */
export const getStackDetailQueryResponseSchema = z.lazy(() => stackDetailDtoSchema);