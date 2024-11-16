import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { PostRefreshTokensMutationRequest, PostRefreshTokensMutationResponse } from "../types/PostRefreshTokens.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const postRefreshTokensMutationKey = () => [{ "url": "/api/Auth/refresh" }] as const;

 export type PostRefreshTokensMutationKey = ReturnType<typeof postRefreshTokensMutationKey>;

 /**
 * @link /api/Auth/refresh
 */
async function postRefreshTokensHook(data: PostRefreshTokensMutationRequest, config: Partial<RequestConfig<PostRefreshTokensMutationRequest>> = {}) {
    const res = await client<PostRefreshTokensMutationResponse, Error, PostRefreshTokensMutationRequest>({ method: "POST", url: `/api/Auth/refresh`, data, ...config });
    return res.data;
}

 /**
 * @link /api/Auth/refresh
 */
export function usePostRefreshTokensHook(options: {
    mutation?: UseMutationOptions<PostRefreshTokensMutationResponse, Error, {
        data: PostRefreshTokensMutationRequest;
    }>;
    client?: Partial<RequestConfig<PostRefreshTokensMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? postRefreshTokensMutationKey();
    return useMutation<PostRefreshTokensMutationResponse, Error, {
        data: PostRefreshTokensMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return postRefreshTokensHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}