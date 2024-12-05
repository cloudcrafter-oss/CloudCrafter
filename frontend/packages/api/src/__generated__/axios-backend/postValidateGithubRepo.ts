import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { PostValidateGithubRepoMutationRequest, PostValidateGithubRepoMutationResponse } from "../types/PostValidateGithubRepo";

 /**
 * @link /api/Utils/validate-git-repository
 */
export async function postValidateGithubRepo(data: PostValidateGithubRepoMutationRequest, config: Partial<RequestConfig<PostValidateGithubRepoMutationRequest>> = {}) {
    const res = await client<PostValidateGithubRepoMutationResponse, Error, PostValidateGithubRepoMutationRequest>({ method: "POST", url: `/api/Utils/validate-git-repository`, data, ...config });
    return res.data;
}