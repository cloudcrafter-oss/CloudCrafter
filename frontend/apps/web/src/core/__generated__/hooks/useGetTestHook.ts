import client from "../../frontend/client.ts";
import { useMutation } from "@tanstack/react-query";
import type { GetTestMutationRequest, GetTestMutationResponse } from "../types/GetTest";
import type { UseMutationOptions } from "@tanstack/react-query";

 type GetTestClient = typeof client<GetTestMutationResponse, Error, GetTestMutationRequest>;
type GetTest = {
    data: GetTestMutationResponse;
    error: Error;
    request: GetTestMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: GetTestMutationResponse;
    client: {
        parameters: Partial<Parameters<GetTestClient>[0]>;
        return: Awaited<ReturnType<GetTestClient>>;
    };
};
/**
 * @link /api/Test
 */
export function useGetTestHook(options: {
    mutation?: UseMutationOptions<GetTest["response"], GetTest["error"], GetTest["request"]>;
    client?: GetTest["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<GetTest["data"], GetTest["error"], GetTest["request"]>({
                method: "post",
                url: `/api/Test`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}