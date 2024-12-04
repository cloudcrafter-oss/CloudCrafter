import { z } from "zod";

 export const stackServiceHttpConfigurationDtoSchema = z.object({ "domainName": z.string().nullable() }).nullable();