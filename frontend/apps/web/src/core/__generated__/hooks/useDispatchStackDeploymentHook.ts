import client from "../../frontend/client.ts";
import { useMutation } from "@tanstack/react-query";
import type { DispatchStackDeploymentMutationResponse, DispatchStackDeploymentPathParams } from "../types/DispatchStackDeployment";
import type { UseMutationOptions } from "@tanstack/react-query";

 type DispatchStackDeploymentClient = typeof client<DispatchStackDeploymentMutationResponse, never, never>;
type DispatchStackDeployment = {
    data: DispatchStackDeploymentMutationResponse;
    error: never;
    request: never;
    pathParams: DispatchStackDeploymentPathParams;
    queryParams: never;
    headerParams: never;
    response: DispatchStackDeploymentMutationResponse;
    client: {
        parameters: Partial<Parameters<DispatchStackDeploymentClient>[0]>;
        return: Awaited<ReturnType<DispatchStackDeploymentClient>>;
    };
};
/**
 * @link /api/Stacks/:id/deploy
 */
export function useDispatchStackDeploymentHook(id: DispatchStackDeploymentPathParams["id"], options: {
    mutation?: UseMutationOptions<DispatchStackDeployment["response"], DispatchStackDeployment["error"], DispatchStackDeployment["request"]>;
    client?: DispatchStackDeployment["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async () => {
            const res = await client<DispatchStackDeployment["data"], DispatchStackDeployment["error"], DispatchStackDeployment["request"]>({
                method: "post",
                url: `/api/Stacks/${id}/deploy`,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}