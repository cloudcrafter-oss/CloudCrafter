import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { PostCreateStackMutationRequest, PostCreateStackMutationResponse } from "../types/PostCreateStack";

 /**
 * @link /api/Stacks
 */
export async function postCreateStack(data: PostCreateStackMutationRequest, config: Partial<RequestConfig<PostCreateStackMutationRequest>> = {}) {
    const res = await client<PostCreateStackMutationResponse, Error, PostCreateStackMutationRequest>({ method: "POST", url: `/api/Stacks`, data, ...config });
    return res.data;
}