import { filterOperatorOptionSchema } from "./filterOperatorOptionSchema";
import { z } from "zod";


export const filterCritereaSchema = z.object({ "propertyName": z.string(), "operator": z.lazy(() => filterOperatorOptionSchema), "value": z.string().nullable().nullish() });