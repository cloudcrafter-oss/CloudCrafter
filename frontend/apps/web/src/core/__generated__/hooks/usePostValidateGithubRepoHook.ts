import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { PostValidateGithubRepoMutationRequest, PostValidateGithubRepoMutationResponse } from "../types/PostValidateGithubRepo.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const postValidateGithubRepoMutationKey = () => [{ "url": "/api/Utils/validate-git-repository" }] as const;

 export type PostValidateGithubRepoMutationKey = ReturnType<typeof postValidateGithubRepoMutationKey>;

 /**
 * @link /api/Utils/validate-git-repository
 */
async function postValidateGithubRepoHook(data: PostValidateGithubRepoMutationRequest, config: Partial<RequestConfig<PostValidateGithubRepoMutationRequest>> = {}) {
    const res = await client<PostValidateGithubRepoMutationResponse, Error, PostValidateGithubRepoMutationRequest>({ method: "POST", url: `/api/Utils/validate-git-repository`, data, ...config });
    return res.data;
}

 /**
 * @link /api/Utils/validate-git-repository
 */
export function usePostValidateGithubRepoHook(options: {
    mutation?: UseMutationOptions<PostValidateGithubRepoMutationResponse, Error, {
        data: PostValidateGithubRepoMutationRequest;
    }>;
    client?: Partial<RequestConfig<PostValidateGithubRepoMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? postValidateGithubRepoMutationKey();
    return useMutation<PostValidateGithubRepoMutationResponse, Error, {
        data: PostValidateGithubRepoMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return postValidateGithubRepoHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}