import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { PostCreateGithubAppMutationRequest, PostCreateGithubAppMutationResponse, PostCreateGithubApp400 } from "../types/PostCreateGithubApp";

 /**
 * {@link /api/Providers}
 */
export async function postCreateGithubApp(data: PostCreateGithubAppMutationRequest, config: Partial<RequestConfig<PostCreateGithubAppMutationRequest>> = {}) {
    const res = await client<PostCreateGithubAppMutationResponse, PostCreateGithubApp400, PostCreateGithubAppMutationRequest>({ method: "POST", url: `/api/Providers`, data, headers: { "Content-Type": "application/*+json", ...config.headers }, ...config });
    return res.data;
}