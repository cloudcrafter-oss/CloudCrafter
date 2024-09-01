import { z } from "zod";


export const stackHealthStatusSchema = z.enum(["Healthy", "Degraded", "Unhealthy"]);