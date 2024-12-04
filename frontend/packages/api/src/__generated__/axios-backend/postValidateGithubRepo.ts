import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { PostValidateGithubRepoMutationRequest, PostValidateGithubRepoMutationResponse } from "../types/PostValidateGithubRepo.ts";

 /**
 * @link /api/Utils/validate-git-repository
 */
export async function postValidateGithubRepo(data: PostValidateGithubRepoMutationRequest, config: Partial<RequestConfig<PostValidateGithubRepoMutationRequest>> = {}) {
    const res = await client<PostValidateGithubRepoMutationResponse, Error, PostValidateGithubRepoMutationRequest>({ method: "POST", url: `/api/Utils/validate-git-repository`, data, ...config });
    return res.data;
}