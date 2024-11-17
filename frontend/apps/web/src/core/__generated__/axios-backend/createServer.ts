import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { CreateServerMutationRequest, CreateServerMutationResponse } from "../types/CreateServer.ts";

 /**
 * @link /api/Servers
 */
export async function createServer(data: CreateServerMutationRequest, config: Partial<RequestConfig<CreateServerMutationRequest>> = {}) {
    const res = await client<CreateServerMutationResponse, Error, CreateServerMutationRequest>({ method: "POST", url: `/api/Servers`, data, ...config });
    return res.data;
}