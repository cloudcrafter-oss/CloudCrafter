// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { UpdateStackServiceMutationRequest, UpdateStackServiceMutationResponse, UpdateStackServicePathParams } from "../types/UpdateStackService.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const updateStackServiceMutationKey = () => [{ "url": "/api/Stacks/{stackId}/services/{stackServiceId}" }] as const;

 export type UpdateStackServiceMutationKey = ReturnType<typeof updateStackServiceMutationKey>;

 /**
 * @link /api/Stacks/:stackId/services/:stackServiceId
 */
async function updateStackServiceHook(stackId: UpdateStackServicePathParams["stackId"], stackServiceId: UpdateStackServicePathParams["stackServiceId"], data: UpdateStackServiceMutationRequest, config: Partial<RequestConfig<UpdateStackServiceMutationRequest>> = {}) {
    const res = await client<UpdateStackServiceMutationResponse, Error, UpdateStackServiceMutationRequest>({ method: "PATCH", url: `/api/Stacks/${stackId}/services/${stackServiceId}`, data, ...config });
    return res.data;
}

 /**
 * @link /api/Stacks/:stackId/services/:stackServiceId
 */
export function useUpdateStackServiceHook(options: {
    mutation?: UseMutationOptions<UpdateStackServiceMutationResponse, Error, {
        stackId: UpdateStackServicePathParams["stackId"];
        stackServiceId: UpdateStackServicePathParams["stackServiceId"];
        data: UpdateStackServiceMutationRequest;
    }>;
    client?: Partial<RequestConfig<UpdateStackServiceMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? updateStackServiceMutationKey();
    return useMutation<UpdateStackServiceMutationResponse, Error, {
        stackId: UpdateStackServicePathParams["stackId"];
        stackServiceId: UpdateStackServicePathParams["stackServiceId"];
        data: UpdateStackServiceMutationRequest;
    }>({
        mutationFn: async ({ stackId, stackServiceId, data }) => {
            return updateStackServiceHook(stackId, stackServiceId, data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}