// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { PostCreateUserMutationRequest, PostCreateUserMutationResponse } from "../types/PostCreateUser.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const postCreateUserMutationKey = () => [{ "url": "/api/Auth/create" }] as const;

 export type PostCreateUserMutationKey = ReturnType<typeof postCreateUserMutationKey>;

 /**
 * @link /api/Auth/create
 */
async function postCreateUserHook(data: PostCreateUserMutationRequest, config: Partial<RequestConfig<PostCreateUserMutationRequest>> = {}) {
    const res = await client<PostCreateUserMutationResponse, Error, PostCreateUserMutationRequest>({ method: "POST", url: `/api/Auth/create`, data, ...config });
    return res.data;
}

 /**
 * @link /api/Auth/create
 */
export function usePostCreateUserHook(options: {
    mutation?: UseMutationOptions<PostCreateUserMutationResponse, Error, {
        data: PostCreateUserMutationRequest;
    }>;
    client?: Partial<RequestConfig<PostCreateUserMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? postCreateUserMutationKey();
    return useMutation<PostCreateUserMutationResponse, Error, {
        data: PostCreateUserMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return postCreateUserHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}