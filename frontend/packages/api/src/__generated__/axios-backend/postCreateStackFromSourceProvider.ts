import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { PostCreateStackFromSourceProviderMutationRequest, PostCreateStackFromSourceProviderMutationResponse } from "../types/PostCreateStackFromSourceProvider";

 /**
 * {@link /api/Stacks/provider}
 */
export async function postCreateStackFromSourceProvider(data: PostCreateStackFromSourceProviderMutationRequest, config: Partial<RequestConfig<PostCreateStackFromSourceProviderMutationRequest>> = {}) {
    const res = await client<PostCreateStackFromSourceProviderMutationResponse, Error, PostCreateStackFromSourceProviderMutationRequest>({ method: "POST", url: `/api/Stacks/provider`, data, ...config });
    return res.data;
}