import { paginatedListOfUserDtoSchema } from "./paginatedListOfUserDtoSchema.ts";
import { paginatedRequestOfUserDtoSchema } from "./paginatedRequestOfUserDtoSchema.ts";
import { z } from "zod";

 /**
 * @description OK
 */
export const getUsers200Schema = z.lazy(() => paginatedListOfUserDtoSchema);

 export const getUsersMutationRequestSchema = z.lazy(() => paginatedRequestOfUserDtoSchema);

 export const getUsersMutationResponseSchema = z.lazy(() => getUsers200Schema);