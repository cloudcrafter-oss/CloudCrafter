// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { DeleteProviderMutationResponse, DeleteProviderPathParams } from "../types/DeleteProvider";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const deleteProviderMutationKey = () => [{ "url": "/api/Providers/{id}" }] as const;

 export type DeleteProviderMutationKey = ReturnType<typeof deleteProviderMutationKey>;

 /**
 * {@link /api/Providers/:id}
 */
async function deleteProviderHook(id: DeleteProviderPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<DeleteProviderMutationResponse, Error, unknown>({ method: "DELETE", url: `/api/Providers/${id}`, ...config });
    return res.data;
}

 /**
 * {@link /api/Providers/:id}
 */
export function useDeleteProviderHook(options: {
    mutation?: UseMutationOptions<DeleteProviderMutationResponse, Error, {
        id: DeleteProviderPathParams["id"];
    }>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? deleteProviderMutationKey();
    return useMutation<DeleteProviderMutationResponse, Error, {
        id: DeleteProviderPathParams["id"];
    }>({
        mutationFn: async ({ id }) => {
            return deleteProviderHook(id, config);
        },
        mutationKey,
        ...mutationOptions
    });
}