import { z } from "zod";


export const createProjectCommandCommandSchema = z.object({ "name": z.string() });