import { z } from "zod";


export const simpleDeploymentDtoSchema = z.object({ "createdAt": z.string().datetime(), "updatedAt": z.string().datetime(), "id": z.string().uuid() });