import { z } from "zod";
import { paginatedListOfUserDtoSchema } from "./paginatedListOfUserDtoSchema";
import { paginatedRequestOfUserDtoSchema } from "./paginatedRequestOfUserDtoSchema";

 /**
 * @description OK
 */
export const getUsers200Schema = z.lazy(() => paginatedListOfUserDtoSchema);

 export const getUsersMutationRequestSchema = z.lazy(() => paginatedRequestOfUserDtoSchema);
/**
 * @description OK
 */
export const getUsersMutationResponseSchema = z.lazy(() => paginatedListOfUserDtoSchema);