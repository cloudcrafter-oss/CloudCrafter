import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { UpdateServerMutationRequest, UpdateServerMutationResponse, UpdateServerPathParams } from "../types/UpdateServer";

 /**
 * {@link /api/Servers/:id}
 */
export async function updateServer(id: UpdateServerPathParams["id"], data?: UpdateServerMutationRequest, config: Partial<RequestConfig<UpdateServerMutationRequest>> = {}) {
    const res = await client<UpdateServerMutationResponse, Error, UpdateServerMutationRequest>({ method: "PATCH", url: `/api/Servers/${id}`, data, headers: { "Content-Type": "application/*+json", ...config.headers }, ...config });
    return res.data;
}