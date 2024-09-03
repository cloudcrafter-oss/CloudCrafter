import { stackServiceDtoSchema } from "./stackServiceDtoSchema";
import { stackSourceDtoSchema } from "./stackSourceDtoSchema";
import { z } from "zod";


export const stackDetailDtoSchema = z.object({ "id": z.string().uuid(), "name": z.string(), "services": z.array(z.lazy(() => stackServiceDtoSchema)), "source": z.lazy(() => stackSourceDtoSchema) });