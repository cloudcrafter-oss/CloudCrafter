import { z } from "zod";


export const deploymentCreatedDetailsDtoSchema = z.object({ "deploymentId": z.string().uuid() });