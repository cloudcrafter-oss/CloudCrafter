// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { DeleteProjectMutationResponse, DeleteProjectPathParams } from "../types/DeleteProject";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const deleteProjectMutationKey = () => [{ "url": "/api/Projects/{id}" }] as const;

 export type DeleteProjectMutationKey = ReturnType<typeof deleteProjectMutationKey>;

 /**
 * {@link /api/Projects/:id}
 */
async function deleteProjectHook(id: DeleteProjectPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<DeleteProjectMutationResponse, Error, unknown>({ method: "DELETE", url: `/api/Projects/${id}`, ...config });
    return res.data;
}

 /**
 * {@link /api/Projects/:id}
 */
export function useDeleteProjectHook(options: {
    mutation?: UseMutationOptions<DeleteProjectMutationResponse, Error, {
        id: DeleteProjectPathParams["id"];
    }>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? deleteProjectMutationKey();
    return useMutation<DeleteProjectMutationResponse, Error, {
        id: DeleteProjectPathParams["id"];
    }>({
        mutationFn: async ({ id }) => {
            return deleteProjectHook(id, config);
        },
        mutationKey,
        ...mutationOptions
    });
}