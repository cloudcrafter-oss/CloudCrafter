import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { GetSendExampleMessageToAgentQueryResponse, GetSendExampleMessageToAgentQueryParams } from "../types/GetSendExampleMessageToAgent";

 /**
 * @link /api/Test/agent
 */
export async function getSendExampleMessageToAgent(params: GetSendExampleMessageToAgentQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetSendExampleMessageToAgentQueryResponse>["data"]> {
    const res = await client<GetSendExampleMessageToAgentQueryResponse>({ method: "get", url: `/api/Test/agent`, params, ...options });
    return res.data;
}