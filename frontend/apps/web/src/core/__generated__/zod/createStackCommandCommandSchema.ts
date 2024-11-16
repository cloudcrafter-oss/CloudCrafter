import { z } from "zod";

 export const createStackCommandCommandSchema = z.object({ "name": z.string().min(3), "gitRepository": z.string().min(1), "environmentId": z.string().uuid(), "serverId": z.string().uuid() });