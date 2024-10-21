import { z } from "zod";


export const getSendExampleMessageToAgentQueryParamsSchema = z.object({ "serverId": z.string().uuid() });
/**
 * @description OK
 */
export const getSendExampleMessageToAgent200Schema = z.any();

 export const getSendExampleMessageToAgentQueryResponseSchema = z.any();