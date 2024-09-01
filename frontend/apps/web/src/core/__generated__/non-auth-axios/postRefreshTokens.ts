import client from "../../backend/non-auth-client.ts";
import type { ResponseConfig } from "../../backend/non-auth-client.ts";
import type { PostRefreshTokensMutationRequest, PostRefreshTokensMutationResponse } from "../types/PostRefreshTokens";

 /**
 * @link /api/Auth/refresh
 */
export async function postRefreshTokens(data: PostRefreshTokensMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<PostRefreshTokensMutationResponse>["data"]> {
    const res = await client<PostRefreshTokensMutationResponse, PostRefreshTokensMutationRequest>({ method: "post", url: `/api/Auth/refresh`, data, ...options });
    return res.data;
}