import client from "../../frontend/client.ts";
import { useMutation } from "@tanstack/react-query";
import type { CreateProjectMutationRequest, CreateProjectMutationResponse } from "../types/CreateProject";
import type { UseMutationOptions } from "@tanstack/react-query";

 type CreateProjectClient = typeof client<CreateProjectMutationResponse, never, CreateProjectMutationRequest>;
type CreateProject = {
    data: CreateProjectMutationResponse;
    error: never;
    request: CreateProjectMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: CreateProjectMutationResponse;
    client: {
        parameters: Partial<Parameters<CreateProjectClient>[0]>;
        return: Awaited<ReturnType<CreateProjectClient>>;
    };
};
/**
 * @link /api/Projects
 */
export function useCreateProjectHook(options: {
    mutation?: UseMutationOptions<CreateProject["response"], CreateProject["error"], CreateProject["request"]>;
    client?: CreateProject["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<CreateProject["data"], CreateProject["error"], CreateProject["request"]>({
                method: "post",
                url: `/api/Projects`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}