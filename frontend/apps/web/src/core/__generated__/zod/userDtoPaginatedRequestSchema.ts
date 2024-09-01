import { filterCritereaSchema } from "./filterCritereaSchema";
import { sortModelSchema } from "./sortModelSchema";
import { z } from "zod";


export const userDtoPaginatedRequestSchema = z.object({ "page": z.number().int(), "pageSize": z.number().int(), "filters": z.array(z.lazy(() => filterCritereaSchema)), "sortBy": z.array(z.lazy(() => sortModelSchema)).nullable().nullish() });