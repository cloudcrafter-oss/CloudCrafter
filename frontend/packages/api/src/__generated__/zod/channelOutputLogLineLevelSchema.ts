import { z } from "zod";

 export const channelOutputLogLineLevelSchema = z.enum(["Verbose", "Debug", "Information", "Warning", "Error", "Fatal"]);