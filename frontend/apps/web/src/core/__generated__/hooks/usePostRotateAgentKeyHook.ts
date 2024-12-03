// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { PostRotateAgentKeyMutationResponse, PostRotateAgentKeyPathParams } from "../types/PostRotateAgentKey.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const postRotateAgentKeyMutationKey = () => [{ "url": "/api/Servers/{id}/rotate-key" }] as const;

 export type PostRotateAgentKeyMutationKey = ReturnType<typeof postRotateAgentKeyMutationKey>;

 /**
 * @link /api/Servers/:id/rotate-key
 */
async function postRotateAgentKeyHook(id: PostRotateAgentKeyPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<PostRotateAgentKeyMutationResponse, Error, unknown>({ method: "POST", url: `/api/Servers/${id}/rotate-key`, ...config });
    return res.data;
}

 /**
 * @link /api/Servers/:id/rotate-key
 */
export function usePostRotateAgentKeyHook(options: {
    mutation?: UseMutationOptions<PostRotateAgentKeyMutationResponse, Error, {
        id: PostRotateAgentKeyPathParams["id"];
    }>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? postRotateAgentKeyMutationKey();
    return useMutation<PostRotateAgentKeyMutationResponse, Error, {
        id: PostRotateAgentKeyPathParams["id"];
    }>({
        mutationFn: async ({ id }) => {
            return postRotateAgentKeyHook(id, config);
        },
        mutationKey,
        ...mutationOptions
    });
}