import { filterCritereaSchema } from "./filterCritereaSchema";
import { sortModelSchema } from "./sortModelSchema";
import { z } from "zod";


export const paginatedRequestOfUserDtoSchema = z.object({ "filters": z.array(z.lazy(() => filterCritereaSchema)), "sortBy": z.array(z.lazy(() => sortModelSchema)).nullable().nullish(), "page": z.number().int(), "pageSize": z.number().int() });