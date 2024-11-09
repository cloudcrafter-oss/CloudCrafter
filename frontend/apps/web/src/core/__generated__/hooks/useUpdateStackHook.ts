import client from "../../frontend/client.ts";
import { useMutation } from "@tanstack/react-query";
import type { UpdateStackMutationRequest, UpdateStackMutationResponse, UpdateStackPathParams, UpdateStack404 } from "../types/UpdateStack";
import type { UseMutationOptions } from "@tanstack/react-query";

 type UpdateStackClient = typeof client<UpdateStackMutationResponse, UpdateStack404, UpdateStackMutationRequest>;
type UpdateStack = {
    data: UpdateStackMutationResponse;
    error: UpdateStack404;
    request: UpdateStackMutationRequest;
    pathParams: UpdateStackPathParams;
    queryParams: never;
    headerParams: never;
    response: UpdateStackMutationResponse;
    client: {
        parameters: Partial<Parameters<UpdateStackClient>[0]>;
        return: Awaited<ReturnType<UpdateStackClient>>;
    };
};
/**
 * @link /api/Stacks/:id
 */
export function useUpdateStackHook(id: UpdateStackPathParams["id"], options: {
    mutation?: UseMutationOptions<UpdateStack["response"], UpdateStack["error"], UpdateStack["request"]>;
    client?: UpdateStack["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<UpdateStack["data"], UpdateStack["error"], UpdateStack["request"]>({
                method: "put",
                url: `/api/Stacks/${id}`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}