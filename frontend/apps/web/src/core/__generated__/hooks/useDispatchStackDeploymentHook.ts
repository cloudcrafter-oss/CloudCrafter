// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { DispatchStackDeploymentMutationResponse, DispatchStackDeploymentPathParams } from "../types/DispatchStackDeployment.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const dispatchStackDeploymentMutationKey = () => [{ "url": "/api/Stacks/{id}/deploy" }] as const;

 export type DispatchStackDeploymentMutationKey = ReturnType<typeof dispatchStackDeploymentMutationKey>;

 /**
 * @link /api/Stacks/:id/deploy
 */
async function dispatchStackDeploymentHook(id: DispatchStackDeploymentPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<DispatchStackDeploymentMutationResponse, Error, unknown>({ method: "POST", url: `/api/Stacks/${id}/deploy`, ...config });
    return res.data;
}

 /**
 * @link /api/Stacks/:id/deploy
 */
export function useDispatchStackDeploymentHook(options: {
    mutation?: UseMutationOptions<DispatchStackDeploymentMutationResponse, Error, {
        id: DispatchStackDeploymentPathParams["id"];
    }>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? dispatchStackDeploymentMutationKey();
    return useMutation<DispatchStackDeploymentMutationResponse, Error, {
        id: DispatchStackDeploymentPathParams["id"];
    }>({
        mutationFn: async ({ id }) => {
            return dispatchStackDeploymentHook(id, config);
        },
        mutationKey,
        ...mutationOptions
    });
}