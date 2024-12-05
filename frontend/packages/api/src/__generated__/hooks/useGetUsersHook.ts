// @ts-nocheck - This file is auto-generated and contains intentionally unused type parameters
import client from "../../frontend/client";
import type { RequestConfig } from "../../frontend/client";
import type { GetUsersMutationRequest, GetUsersMutationResponse } from "../types/GetUsers";
import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

 export const getUsersMutationKey = () => [{ "url": "/api/Users" }] as const;

 export type GetUsersMutationKey = ReturnType<typeof getUsersMutationKey>;

 /**
 * @link /api/Users
 */
async function getUsersHook(data: GetUsersMutationRequest, config: Partial<RequestConfig<GetUsersMutationRequest>> = {}) {
    const res = await client<GetUsersMutationResponse, Error, GetUsersMutationRequest>({ method: "POST", url: `/api/Users`, data, ...config });
    return res.data;
}

 /**
 * @link /api/Users
 */
export function useGetUsersHook(options: {
    mutation?: UseMutationOptions<GetUsersMutationResponse, Error, {
        data: GetUsersMutationRequest;
    }>;
    client?: Partial<RequestConfig<GetUsersMutationRequest>>;
} = {}) {
    const { mutation: mutationOptions, client: config = {} } = options ?? {};
    const mutationKey = mutationOptions?.mutationKey ?? getUsersMutationKey();
    return useMutation<GetUsersMutationResponse, Error, {
        data: GetUsersMutationRequest;
    }>({
        mutationFn: async ({ data }) => {
            return getUsersHook(data, config);
        },
        mutationKey,
        ...mutationOptions
    });
}