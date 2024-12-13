// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { PostCreateGithubAppMutationRequest, PostCreateGithubAppMutationResponse, PostCreateGithubApp400 } from "../types/PostCreateGithubApp";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const postCreateGithubAppMutationKey = () => [{ "url": "/api/Providers" }] as const;

 export type PostCreateGithubAppMutationKey = ReturnType<typeof postCreateGithubAppMutationKey>;

 /**
 * {@link /api/Providers}
 */
async function postCreateGithubAppHook(data: PostCreateGithubAppMutationRequest, config: Partial<RequestConfig<PostCreateGithubAppMutationRequest>> = {}) {
    const res = await client<PostCreateGithubAppMutationResponse, PostCreateGithubApp400, PostCreateGithubAppMutationRequest>({ method: "POST", url: `/api/Providers`, data, headers: { "Content-Type": "application/*+json", ...config.headers }, ...config });
    return res.data;
}

 /**
 * {@link /api/Providers}
 */
export function usePostCreateGithubAppHook(options: {
    mutation?: UseMutationOptions<PostCreateGithubAppMutationResponse, PostCreateGithubApp400, {
        data: PostCreateGithubAppMutationRequest;
    }>;
    client?: Partial<RequestConfig<PostCreateGithubAppMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? postCreateGithubAppMutationKey();
    return useMutation<PostCreateGithubAppMutationResponse, PostCreateGithubApp400, {
        data: PostCreateGithubAppMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return postCreateGithubAppHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}