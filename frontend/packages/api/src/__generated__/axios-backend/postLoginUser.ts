import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { PostLoginUserMutationRequest, PostLoginUserMutationResponse } from "../types/PostLoginUser";

 /**
 * {@link /api/Auth/login}
 */
export async function postLoginUser(data: PostLoginUserMutationRequest, config: Partial<RequestConfig<PostLoginUserMutationRequest>> = {}) {
    const res = await client<PostLoginUserMutationResponse, Error, PostLoginUserMutationRequest>({ method: "POST", url: `/api/Auth/login`, data, ...config });
    return res.data;
}