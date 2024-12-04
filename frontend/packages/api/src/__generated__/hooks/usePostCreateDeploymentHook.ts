// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client.ts";
import type { RequestConfig } from "../../frontend/client.ts";
import type { PostCreateDeploymentMutationResponse, PostCreateDeploymentPathParams } from "../types/PostCreateDeployment.ts";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const postCreateDeploymentMutationKey = () => [{ "url": "/api/Applications/{applicationId}/deployment" }] as const;

 export type PostCreateDeploymentMutationKey = ReturnType<typeof postCreateDeploymentMutationKey>;

 /**
 * @link /api/Applications/:applicationId/deployment
 */
async function postCreateDeploymentHook(applicationId: PostCreateDeploymentPathParams["applicationId"], config: Partial<RequestConfig> = {}) {
    const res = await client<PostCreateDeploymentMutationResponse, Error, unknown>({ method: "POST", url: `/api/Applications/${applicationId}/deployment`, ...config });
    return res.data;
}

 /**
 * @link /api/Applications/:applicationId/deployment
 */
export function usePostCreateDeploymentHook(options: {
    mutation?: UseMutationOptions<PostCreateDeploymentMutationResponse, Error, {
        applicationId: PostCreateDeploymentPathParams["applicationId"];
    }>;
    client?: Partial<RequestConfig>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? postCreateDeploymentMutationKey();
    return useMutation<PostCreateDeploymentMutationResponse, Error, {
        applicationId: PostCreateDeploymentPathParams["applicationId"];
    }>({
        mutationFn: async ({ applicationId }) => {
            return postCreateDeploymentHook(applicationId, config);
        },
        mutationKey,
        ...mutationOptions
    });
}