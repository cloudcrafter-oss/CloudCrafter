// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { CreateServerMutationRequest, CreateServerMutationResponse } from "../types/CreateServer";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const createServerMutationKey = () => [{ "url": "/api/Servers" }] as const;

 export type CreateServerMutationKey = ReturnType<typeof createServerMutationKey>;

 /**
 * {@link /api/Servers}
 */
async function createServerHook(data: CreateServerMutationRequest, config: Partial<RequestConfig<CreateServerMutationRequest>> = {}) {
    const res = await client<CreateServerMutationResponse, Error, CreateServerMutationRequest>({ method: "POST", url: `/api/Servers`, data, headers: { "Content-Type": "application/*+json", ...config.headers }, ...config });
    return res.data;
}

 /**
 * {@link /api/Servers}
 */
export function useCreateServerHook(options: {
    mutation?: UseMutationOptions<CreateServerMutationResponse, Error, {
        data: CreateServerMutationRequest;
    }>;
    client?: Partial<RequestConfig<CreateServerMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? createServerMutationKey();
    return useMutation<CreateServerMutationResponse, Error, {
        data: CreateServerMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return createServerHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}