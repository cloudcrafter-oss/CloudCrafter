import { z } from "zod";

 export const gitProviderBranchDtoSchema = z.object({ "name": z.string() });