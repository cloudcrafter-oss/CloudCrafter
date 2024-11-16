import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { PostLoginUserMutationRequest, PostLoginUserMutationResponse } from "../types/PostLoginUser.ts";

 /**
 * @link /api/Auth/login
 */
export async function postLoginUser(data: PostLoginUserMutationRequest, config: Partial<RequestConfig<PostLoginUserMutationRequest>> = {}) {
    const res = await client<PostLoginUserMutationResponse, Error, PostLoginUserMutationRequest>({ method: "POST", url: `/api/Auth/login`, data, ...config });
    return res.data;
}