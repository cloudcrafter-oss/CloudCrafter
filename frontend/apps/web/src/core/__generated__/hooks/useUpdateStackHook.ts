import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { UpdateStackMutationRequest, UpdateStackMutationResponse, UpdateStackPathParams, UpdateStack404 } from "../types/UpdateStack.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const updateStackMutationKey = () => [{ "url": "/api/Stacks/{id}" }] as const;

 export type UpdateStackMutationKey = ReturnType<typeof updateStackMutationKey>;

 /**
 * @link /api/Stacks/:id
 */
async function updateStackHook(id: UpdateStackPathParams["id"], data: UpdateStackMutationRequest, config: Partial<RequestConfig<UpdateStackMutationRequest>> = {}) {
    const res = await client<UpdateStackMutationResponse, UpdateStack404, UpdateStackMutationRequest>({ method: "PUT", url: `/api/Stacks/${id}`, data, ...config });
    return res.data;
}

 /**
 * @link /api/Stacks/:id
 */
export function useUpdateStackHook(options: {
    mutation?: UseMutationOptions<UpdateStackMutationResponse, UpdateStack404, {
        id: UpdateStackPathParams["id"];
        data: UpdateStackMutationRequest;
    }>;
    client?: Partial<RequestConfig<UpdateStackMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? updateStackMutationKey();
    return useMutation<UpdateStackMutationResponse, UpdateStack404, {
        id: UpdateStackPathParams["id"];
        data: UpdateStackMutationRequest;
    }>({
        mutationFn: async ({ id, data }) => {
            return updateStackHook(id, data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}