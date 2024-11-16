import { sortDirection2Schema } from "./sortDirection2Schema.ts";
import { z } from "zod";

 export const sortModelSchema = z.object({ "field": z.string(), "direction": z.lazy(() => sortDirection2Schema) });