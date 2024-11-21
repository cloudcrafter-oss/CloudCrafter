import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { CreateServerMutationRequest, CreateServerMutationResponse } from "../types/CreateServer.ts";

 /**
 * @link /api/Servers
 */
export async function createServer(data: CreateServerMutationRequest, config: Partial<RequestConfig<CreateServerMutationRequest>> = {}) {
    const res = await client<CreateServerMutationResponse, Error, CreateServerMutationRequest>({ method: "POST", url: `/api/Servers`, data, headers: { "Content-Type": "application/*+json", ...config.headers }, ...config });
    return res.data;
}