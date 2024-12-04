// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { CreateProjectMutationRequest, CreateProjectMutationResponse } from "../types/CreateProject.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const createProjectMutationKey = () => [{ "url": "/api/Projects" }] as const;

 export type CreateProjectMutationKey = ReturnType<typeof createProjectMutationKey>;

 /**
 * @link /api/Projects
 */
async function createProjectHook(data: CreateProjectMutationRequest, config: Partial<RequestConfig<CreateProjectMutationRequest>> = {}) {
    const res = await client<CreateProjectMutationResponse, Error, CreateProjectMutationRequest>({ method: "POST", url: `/api/Projects`, data, ...config });
    return res.data;
}

 /**
 * @link /api/Projects
 */
export function useCreateProjectHook(options: {
    mutation?: UseMutationOptions<CreateProjectMutationResponse, Error, {
        data: CreateProjectMutationRequest;
    }>;
    client?: Partial<RequestConfig<CreateProjectMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? createProjectMutationKey();
    return useMutation<CreateProjectMutationResponse, Error, {
        data: CreateProjectMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return createProjectHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}