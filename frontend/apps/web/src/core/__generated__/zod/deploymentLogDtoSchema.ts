import { channelOutputLogLineLevelSchema } from "./channelOutputLogLineLevelSchema";
import { z } from "zod";


export const deploymentLogDtoSchema = z.object({ "message": z.string(), "level": z.lazy(() => channelOutputLogLineLevelSchema), "at": z.string().datetime() });