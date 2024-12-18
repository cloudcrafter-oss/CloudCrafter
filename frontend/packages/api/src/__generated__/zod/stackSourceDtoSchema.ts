import { gitApplicationSourceDtoSchema } from "./gitApplicationSourceDtoSchema";
import { githubApplicationSourceDtoSchema } from "./githubApplicationSourceDtoSchema";
import { stackSourceDtoTypeSchema } from "./stackSourceDtoTypeSchema";
import { z } from "zod";

 export const stackSourceDtoSchema = z.object({ "type": z.lazy(() => stackSourceDtoTypeSchema), "git": z.lazy(() => gitApplicationSourceDtoSchema).nullable(), "githubApp": z.lazy(() => githubApplicationSourceDtoSchema).nullable() }).nullable();