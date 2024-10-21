import client from "../../frontend/client.ts";
import { useMutation } from "@tanstack/react-query";
import type { DeleteProjectMutationResponse, DeleteProjectPathParams } from "../types/DeleteProject";
import type { UseMutationOptions } from "@tanstack/react-query";

 type DeleteProjectClient = typeof client<DeleteProjectMutationResponse, Error, never>;
type DeleteProject = {
    data: DeleteProjectMutationResponse;
    error: Error;
    request: never;
    pathParams: DeleteProjectPathParams;
    queryParams: never;
    headerParams: never;
    response: DeleteProjectMutationResponse;
    client: {
        parameters: Partial<Parameters<DeleteProjectClient>[0]>;
        return: Awaited<ReturnType<DeleteProjectClient>>;
    };
};
/**
 * @link /api/Projects/:id
 */
export function useDeleteProjectHook(id: DeleteProjectPathParams["id"], options: {
    mutation?: UseMutationOptions<DeleteProject["response"], DeleteProject["error"], DeleteProject["request"]>;
    client?: DeleteProject["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async () => {
            const res = await client<DeleteProject["data"], DeleteProject["error"], DeleteProject["request"]>({
                method: "delete",
                url: `/api/Projects/${id}`,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}