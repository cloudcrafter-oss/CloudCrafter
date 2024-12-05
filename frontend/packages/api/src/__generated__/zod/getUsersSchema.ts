import { paginatedListOfUserDtoSchema } from "./paginatedListOfUserDtoSchema";
import { paginatedRequestOfUserDtoSchema } from "./paginatedRequestOfUserDtoSchema";
import { z } from "zod";

 /**
 * @description OK
 */
export const getUsers200Schema = z.lazy(() => paginatedListOfUserDtoSchema);

 export const getUsersMutationRequestSchema = z.lazy(() => paginatedRequestOfUserDtoSchema);

 export const getUsersMutationResponseSchema = z.lazy(() => getUsers200Schema);