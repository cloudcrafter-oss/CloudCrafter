// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { PostLoginUserMutationRequest, PostLoginUserMutationResponse } from "../types/PostLoginUser";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const postLoginUserMutationKey = () => [{ "url": "/api/Auth/login" }] as const;

 export type PostLoginUserMutationKey = ReturnType<typeof postLoginUserMutationKey>;

 /**
 * {@link /api/Auth/login}
 */
async function postLoginUserHook(data: PostLoginUserMutationRequest, config: Partial<RequestConfig<PostLoginUserMutationRequest>> = {}) {
    const res = await client<PostLoginUserMutationResponse, Error, PostLoginUserMutationRequest>({ method: "POST", url: `/api/Auth/login`, data, ...config });
    return res.data;
}

 /**
 * {@link /api/Auth/login}
 */
export function usePostLoginUserHook(options: {
    mutation?: UseMutationOptions<PostLoginUserMutationResponse, Error, {
        data: PostLoginUserMutationRequest;
    }>;
    client?: Partial<RequestConfig<PostLoginUserMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? postLoginUserMutationKey();
    return useMutation<PostLoginUserMutationResponse, Error, {
        data: PostLoginUserMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return postLoginUserHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}