import { z } from "zod";

 /**
 * @description OK
 */
export const test200Schema = z.array(z.string());

 export const testQueryResponseSchema = z.lazy(() => test200Schema);