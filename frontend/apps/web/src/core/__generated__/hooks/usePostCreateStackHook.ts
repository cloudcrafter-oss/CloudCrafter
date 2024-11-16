import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { PostCreateStackMutationRequest, PostCreateStackMutationResponse } from "../types/PostCreateStack.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const postCreateStackMutationKey = () => [{ "url": "/api/Stacks" }] as const;

 export type PostCreateStackMutationKey = ReturnType<typeof postCreateStackMutationKey>;

 /**
 * @link /api/Stacks
 */
async function postCreateStackHook(data: PostCreateStackMutationRequest, config: Partial<RequestConfig<PostCreateStackMutationRequest>> = {}) {
    const res = await client<PostCreateStackMutationResponse, Error, PostCreateStackMutationRequest>({ method: "POST", url: `/api/Stacks`, data, ...config });
    return res.data;
}

 /**
 * @link /api/Stacks
 */
export function usePostCreateStackHook(options: {
    mutation?: UseMutationOptions<PostCreateStackMutationResponse, Error, {
        data: PostCreateStackMutationRequest;
    }>;
    client?: Partial<RequestConfig<PostCreateStackMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? postCreateStackMutationKey();
    return useMutation<PostCreateStackMutationResponse, Error, {
        data: PostCreateStackMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return postCreateStackHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}