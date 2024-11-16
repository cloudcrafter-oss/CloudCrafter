import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { PostCreateUserMutationRequest, PostCreateUserMutationResponse } from "../types/PostCreateUser.ts";

 /**
 * @link /api/Auth/create
 */
export async function postCreateUser(data: PostCreateUserMutationRequest, config: Partial<RequestConfig<PostCreateUserMutationRequest>> = {}) {
    const res = await client<PostCreateUserMutationResponse, Error, PostCreateUserMutationRequest>({ method: "POST", url: `/api/Auth/create`, data, ...config });
    return res.data;
}