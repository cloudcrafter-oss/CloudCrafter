import client from "../../frontend/client.ts";
import { useMutation } from "@tanstack/react-query";
import type { PostCreateGithubAppMutationRequest, PostCreateGithubAppMutationResponse, PostCreateGithubApp400 } from "../types/PostCreateGithubApp";
import type { UseMutationOptions } from "@tanstack/react-query";

 type PostCreateGithubAppClient = typeof client<PostCreateGithubAppMutationResponse, PostCreateGithubApp400, PostCreateGithubAppMutationRequest>;
type PostCreateGithubApp = {
    data: PostCreateGithubAppMutationResponse;
    error: PostCreateGithubApp400;
    request: PostCreateGithubAppMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: PostCreateGithubAppMutationResponse;
    client: {
        parameters: Partial<Parameters<PostCreateGithubAppClient>[0]>;
        return: Awaited<ReturnType<PostCreateGithubAppClient>>;
    };
};
/**
 * @link /api/Providers/github
 */
export function usePostCreateGithubAppHook(options: {
    mutation?: UseMutationOptions<PostCreateGithubApp["response"], PostCreateGithubApp["error"], PostCreateGithubApp["request"]>;
    client?: PostCreateGithubApp["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<PostCreateGithubApp["data"], PostCreateGithubApp["error"], PostCreateGithubApp["request"]>({
                method: "post",
                url: `/api/Providers/github`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}