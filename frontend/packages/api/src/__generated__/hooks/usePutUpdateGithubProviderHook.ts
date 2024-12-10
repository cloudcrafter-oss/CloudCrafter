// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { PutUpdateGithubProviderMutationRequest, PutUpdateGithubProviderMutationResponse, PutUpdateGithubProviderPathParams } from "../types/PutUpdateGithubProvider";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const putUpdateGithubProviderMutationKey = () => [{ "url": "/api/Providers/github/{id}/install" }] as const;

 export type PutUpdateGithubProviderMutationKey = ReturnType<typeof putUpdateGithubProviderMutationKey>;

 /**
 * {@link /api/Providers/github/:id/install}
 */
async function putUpdateGithubProviderHook(id: PutUpdateGithubProviderPathParams["id"], data: PutUpdateGithubProviderMutationRequest, config: Partial<RequestConfig<PutUpdateGithubProviderMutationRequest>> = {}) {
    const res = await client<PutUpdateGithubProviderMutationResponse, Error, PutUpdateGithubProviderMutationRequest>({ method: "PUT", url: `/api/Providers/github/${id}/install`, data, headers: { "Content-Type": "application/*+json", ...config.headers }, ...config });
    return res.data;
}

 /**
 * {@link /api/Providers/github/:id/install}
 */
export function usePutUpdateGithubProviderHook(options: {
    mutation?: UseMutationOptions<PutUpdateGithubProviderMutationResponse, Error, {
        id: PutUpdateGithubProviderPathParams["id"];
        data: PutUpdateGithubProviderMutationRequest;
    }>;
    client?: Partial<RequestConfig<PutUpdateGithubProviderMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? putUpdateGithubProviderMutationKey();
    return useMutation<PutUpdateGithubProviderMutationResponse, Error, {
        id: PutUpdateGithubProviderPathParams["id"];
        data: PutUpdateGithubProviderMutationRequest;
    }>({
        mutationFn: async ({ id, data }) => {
            return putUpdateGithubProviderHook(id, data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}