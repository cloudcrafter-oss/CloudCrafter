import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { PostCreateUserMutationRequest, PostCreateUserMutationResponse } from "../types/PostCreateUser";

 /**
 * {@link /api/Auth/create}
 */
export async function postCreateUser(data: PostCreateUserMutationRequest, config: Partial<RequestConfig<PostCreateUserMutationRequest>> = {}) {
    const res = await client<PostCreateUserMutationResponse, Error, PostCreateUserMutationRequest>({ method: "POST", url: `/api/Auth/create`, data, ...config });
    return res.data;
}