import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { PostValidateGithubRepoMutationRequest, PostValidateGithubRepoMutationResponse } from "../types/PostValidateGithubRepo";

 /**
 * @link /api/Utils/validate-git-repository
 */
export async function postValidateGithubRepo(data: PostValidateGithubRepoMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<PostValidateGithubRepoMutationResponse>["data"]> {
    const res = await client<PostValidateGithubRepoMutationResponse, PostValidateGithubRepoMutationRequest>({ method: "post", url: `/api/Utils/validate-git-repository`, baseURL: "http://[::]:8080", data, ...options });
    return res.data;
}