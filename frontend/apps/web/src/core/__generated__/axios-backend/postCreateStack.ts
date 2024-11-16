import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { PostCreateStackMutationRequest, PostCreateStackMutationResponse } from "../types/PostCreateStack";

 /**
 * @link /api/Stacks
 */
export async function postCreateStack(data: PostCreateStackMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<PostCreateStackMutationResponse>["data"]> {
    const res = await client<PostCreateStackMutationResponse, PostCreateStackMutationRequest>({ method: "post", url: `/api/Stacks`, baseURL: "http://[::]:8080", data, ...options });
    return res.data;
}