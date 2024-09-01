import { z } from "zod";


export const createStackCommandCommandSchema = z.object({ "name": z.string(), "gitRepository": z.string(), "serverId": z.string().uuid(), "environmentId": z.string().uuid() });