// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { DeleteServerByIdMutationResponse, DeleteServerByIdPathParams } from "../types/DeleteServerById.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const deleteServerByIdMutationKey = () => [{ "url": "/api/Servers/{id}" }] as const;

 export type DeleteServerByIdMutationKey = ReturnType<typeof deleteServerByIdMutationKey>;

 /**
 * @link /api/Servers/:id
 */
async function deleteServerByIdHook(id: DeleteServerByIdPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<DeleteServerByIdMutationResponse, Error, unknown>({ method: "DELETE", url: `/api/Servers/${id}`, ...config });
    return res.data;
}

 /**
 * @link /api/Servers/:id
 */
export function useDeleteServerByIdHook(options: {
    mutation?: UseMutationOptions<DeleteServerByIdMutationResponse, Error, {
        id: DeleteServerByIdPathParams["id"];
    }>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? deleteServerByIdMutationKey();
    return useMutation<DeleteServerByIdMutationResponse, Error, {
        id: DeleteServerByIdPathParams["id"];
    }>({
        mutationFn: async ({ id }) => {
            return deleteServerByIdHook(id, config);
        },
        mutationKey,
        ...mutationOptions
    });
}