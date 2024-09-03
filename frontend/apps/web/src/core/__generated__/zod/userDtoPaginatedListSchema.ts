import { userDtoSchema } from "./userDtoSchema";
import { z } from "zod";


export const userDtoPaginatedListSchema = z.object({ "page": z.number().int(), "totalPages": z.number().int(), "totalItems": z.number().int(), "result": z.array(z.lazy(() => userDtoSchema)) });