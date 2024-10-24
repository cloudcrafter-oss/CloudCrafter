import { z } from "zod";


export const deploymentStatusDtoSchema = z.enum(["Created", "Running", "Failed", "Succeeded"]);