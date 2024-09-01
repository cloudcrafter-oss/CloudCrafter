import { z } from "zod";


export const createStackCommandCommandSchema = z.object({ "name": z.string(), "gitRepository": z.string(), "environmentId": z.string().uuid(), "serverId": z.string().uuid() });