import client from "@kubb/plugin-client/client";
import type { PostRefreshTokensMutationRequest, PostRefreshTokensMutationResponse } from "../types/PostRefreshTokens";
import type { RequestConfig } from "@kubb/plugin-client/client";

 /**
 * {@link /api/Auth/refresh}
 */
export async function postRefreshTokens(data: PostRefreshTokensMutationRequest, config: Partial<RequestConfig<PostRefreshTokensMutationRequest>> = {}) {
    const res = await client<PostRefreshTokensMutationResponse, Error, PostRefreshTokensMutationRequest>({ method: "POST", url: `/api/Auth/refresh`, data, ...config });
    return res.data;
}