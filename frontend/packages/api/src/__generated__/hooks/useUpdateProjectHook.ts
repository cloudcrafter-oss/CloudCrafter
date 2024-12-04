// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { UpdateProjectMutationRequest, UpdateProjectMutationResponse, UpdateProjectPathParams } from "../types/UpdateProject.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const updateProjectMutationKey = () => [{ "url": "/api/Projects/{id}" }] as const;

 export type UpdateProjectMutationKey = ReturnType<typeof updateProjectMutationKey>;

 /**
 * @link /api/Projects/:id
 */
async function updateProjectHook(id: UpdateProjectPathParams["id"], data?: UpdateProjectMutationRequest, config: Partial<RequestConfig<UpdateProjectMutationRequest>> = {}) {
    const res = await client<UpdateProjectMutationResponse, Error, UpdateProjectMutationRequest>({ method: "POST", url: `/api/Projects/${id}`, data, ...config });
    return res.data;
}

 /**
 * @link /api/Projects/:id
 */
export function useUpdateProjectHook(options: {
    mutation?: UseMutationOptions<UpdateProjectMutationResponse, Error, {
        id: UpdateProjectPathParams["id"];
        data?: UpdateProjectMutationRequest;
    }>;
    client?: Partial<RequestConfig<UpdateProjectMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? updateProjectMutationKey();
    return useMutation<UpdateProjectMutationResponse, Error, {
        id: UpdateProjectPathParams["id"];
        data?: UpdateProjectMutationRequest;
    }>({
        mutationFn: async ({ id, data }) => {
            return updateProjectHook(id, data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}