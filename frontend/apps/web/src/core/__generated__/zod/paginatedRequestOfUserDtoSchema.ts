import { filterCritereaSchema } from "./filterCritereaSchema.ts";
import { sortModelSchema } from "./sortModelSchema.ts";
import { z } from "zod";

 export const paginatedRequestOfUserDtoSchema = z.object({ "filters": z.array(z.lazy(() => filterCritereaSchema)), "sortBy": z.array(z.lazy(() => sortModelSchema)).nullable().nullish(), "page": z.number().int(), "pageSize": z.number().int() });