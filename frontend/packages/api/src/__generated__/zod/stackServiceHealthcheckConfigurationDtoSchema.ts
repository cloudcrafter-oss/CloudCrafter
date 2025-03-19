import { z } from "zod";

 export const stackServiceHealthcheckConfigurationDtoSchema = z.object({ "httpPort": z.number().int().nullable() });