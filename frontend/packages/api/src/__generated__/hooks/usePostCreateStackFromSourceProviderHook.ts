// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { PostCreateStackFromSourceProviderMutationRequest, PostCreateStackFromSourceProviderMutationResponse } from "../types/PostCreateStackFromSourceProvider";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const postCreateStackFromSourceProviderMutationKey = () => [{ "url": "/api/Stacks/provider" }] as const;

 export type PostCreateStackFromSourceProviderMutationKey = ReturnType<typeof postCreateStackFromSourceProviderMutationKey>;

 /**
 * {@link /api/Stacks/provider}
 */
async function postCreateStackFromSourceProviderHook(data: PostCreateStackFromSourceProviderMutationRequest, config: Partial<RequestConfig<PostCreateStackFromSourceProviderMutationRequest>> = {}) {
    const res = await client<PostCreateStackFromSourceProviderMutationResponse, Error, PostCreateStackFromSourceProviderMutationRequest>({ method: "POST", url: `/api/Stacks/provider`, data, ...config });
    return res.data;
}

 /**
 * {@link /api/Stacks/provider}
 */
export function usePostCreateStackFromSourceProviderHook(options: {
    mutation?: UseMutationOptions<PostCreateStackFromSourceProviderMutationResponse, Error, {
        data: PostCreateStackFromSourceProviderMutationRequest;
    }>;
    client?: Partial<RequestConfig<PostCreateStackFromSourceProviderMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? postCreateStackFromSourceProviderMutationKey();
    return useMutation<PostCreateStackFromSourceProviderMutationResponse, Error, {
        data: PostCreateStackFromSourceProviderMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return postCreateStackFromSourceProviderHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}