import client from "../../frontend/client.ts";
import { useMutation } from "@tanstack/react-query";
import type { PostCreateStackMutationRequest, PostCreateStackMutationResponse } from "../types/PostCreateStack";
import type { UseMutationOptions } from "@tanstack/react-query";

 type PostCreateStackClient = typeof client<PostCreateStackMutationResponse, Error, PostCreateStackMutationRequest>;
type PostCreateStack = {
    data: PostCreateStackMutationResponse;
    error: Error;
    request: PostCreateStackMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: PostCreateStackMutationResponse;
    client: {
        parameters: Partial<Parameters<PostCreateStackClient>[0]>;
        return: Awaited<ReturnType<PostCreateStackClient>>;
    };
};
/**
 * @link /api/Stacks
 */
export function usePostCreateStackHook(options: {
    mutation?: UseMutationOptions<PostCreateStack["response"], PostCreateStack["error"], PostCreateStack["request"]>;
    client?: PostCreateStack["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<PostCreateStack["data"], PostCreateStack["error"], PostCreateStack["request"]>({
                method: "post",
                url: `/api/Stacks`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}