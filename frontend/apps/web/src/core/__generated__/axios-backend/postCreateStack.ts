import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { PostCreateStackMutationRequest, PostCreateStackMutationResponse } from "../types/PostCreateStack.ts";

 /**
 * @link /api/Stacks
 */
export async function postCreateStack(data: PostCreateStackMutationRequest, config: Partial<RequestConfig<PostCreateStackMutationRequest>> = {}) {
    const res = await client<PostCreateStackMutationResponse, Error, PostCreateStackMutationRequest>({ method: "POST", url: `/api/Stacks`, data, ...config });
    return res.data;
}