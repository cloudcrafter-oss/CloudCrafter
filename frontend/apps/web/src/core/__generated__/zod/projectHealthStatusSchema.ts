import { z } from "zod";


export const projectHealthStatusSchema = z.enum(["Healthy", "Degraded", "Unhealthy", "Unknown"]);