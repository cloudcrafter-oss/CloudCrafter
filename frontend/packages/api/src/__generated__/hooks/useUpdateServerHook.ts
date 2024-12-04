// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { UpdateServerMutationRequest, UpdateServerMutationResponse, UpdateServerPathParams } from "../types/UpdateServer.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const updateServerMutationKey = () => [{ "url": "/api/Servers/{id}" }] as const;

 export type UpdateServerMutationKey = ReturnType<typeof updateServerMutationKey>;

 /**
 * @link /api/Servers/:id
 */
async function updateServerHook(id: UpdateServerPathParams["id"], data?: UpdateServerMutationRequest, config: Partial<RequestConfig<UpdateServerMutationRequest>> = {}) {
    const res = await client<UpdateServerMutationResponse, Error, UpdateServerMutationRequest>({ method: "PATCH", url: `/api/Servers/${id}`, data, headers: { "Content-Type": "application/*+json", ...config.headers }, ...config });
    return res.data;
}

 /**
 * @link /api/Servers/:id
 */
export function useUpdateServerHook(options: {
    mutation?: UseMutationOptions<UpdateServerMutationResponse, Error, {
        id: UpdateServerPathParams["id"];
        data?: UpdateServerMutationRequest;
    }>;
    client?: Partial<RequestConfig<UpdateServerMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? updateServerMutationKey();
    return useMutation<UpdateServerMutationResponse, Error, {
        id: UpdateServerPathParams["id"];
        data?: UpdateServerMutationRequest;
    }>({
        mutationFn: async ({ id, data }) => {
            return updateServerHook(id, data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}