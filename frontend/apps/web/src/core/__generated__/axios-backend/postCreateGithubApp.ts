import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { PostCreateGithubAppMutationRequest, PostCreateGithubAppMutationResponse } from "../types/PostCreateGithubApp";

 /**
 * @link /api/Providers/github
 */
export async function postCreateGithubApp(data: PostCreateGithubAppMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<PostCreateGithubAppMutationResponse>["data"]> {
    const res = await client<PostCreateGithubAppMutationResponse, PostCreateGithubAppMutationRequest>({ method: "post", url: `/api/Providers/github`, baseURL: "http://[::]:8080", data, ...options });
    return res.data;
}