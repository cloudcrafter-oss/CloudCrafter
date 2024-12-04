import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetUsersMutationRequest, GetUsersMutationResponse } from "../types/GetUsers.ts";

 /**
 * @link /api/Users
 */
export async function getUsers(data: GetUsersMutationRequest, config: Partial<RequestConfig<GetUsersMutationRequest>> = {}) {
    const res = await client<GetUsersMutationResponse, Error, GetUsersMutationRequest>({ method: "POST", url: `/api/Users`, data, ...config });
    return res.data;
}