import { z } from "zod";


export const stackSourceTypeSchema = z.enum(["Git", "GitSsh"]);