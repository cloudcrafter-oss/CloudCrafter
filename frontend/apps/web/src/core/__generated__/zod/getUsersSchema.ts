import { z } from "zod";
import { userDtoPaginatedListSchema } from "./userDtoPaginatedListSchema";
import { userDtoPaginatedRequestSchema } from "./userDtoPaginatedRequestSchema";

 /**
 * @description OK
 */
export const getUsers200Schema = z.lazy(() => userDtoPaginatedListSchema);

 export const getUsersMutationRequestSchema = z.lazy(() => userDtoPaginatedRequestSchema);
/**
 * @description OK
 */
export const getUsersMutationResponseSchema = z.lazy(() => userDtoPaginatedListSchema);