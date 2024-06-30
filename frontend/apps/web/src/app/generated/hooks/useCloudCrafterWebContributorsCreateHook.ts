import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { CloudCrafterWebContributorsCreateMutationRequest, CloudCrafterWebContributorsCreateMutationResponse, CloudCrafterWebContributorsCreate400 } from "../types/CloudCrafterWebContributorsCreate";
import type { UseMutationOptions } from "@tanstack/react-query";

 type CloudCrafterWebContributorsCreateClient = typeof client<CloudCrafterWebContributorsCreateMutationResponse, CloudCrafterWebContributorsCreate400, CloudCrafterWebContributorsCreateMutationRequest>;
type CloudCrafterWebContributorsCreate = {
    data: CloudCrafterWebContributorsCreateMutationResponse;
    error: CloudCrafterWebContributorsCreate400;
    request: CloudCrafterWebContributorsCreateMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: CloudCrafterWebContributorsCreateMutationResponse;
    client: {
        parameters: Partial<Parameters<CloudCrafterWebContributorsCreateClient>[0]>;
        return: Awaited<ReturnType<CloudCrafterWebContributorsCreateClient>>;
    };
};
/**
 * @description Creates a new Contributor given a name.
 * @summary Create a new Contributor
 * @link /Contributors
 */
export function useCloudCrafterWebContributorsCreateHook(options: {
    mutation?: UseMutationOptions<CloudCrafterWebContributorsCreate["response"], CloudCrafterWebContributorsCreate["error"], CloudCrafterWebContributorsCreate["request"]>;
    client?: CloudCrafterWebContributorsCreate["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<CloudCrafterWebContributorsCreate["data"], CloudCrafterWebContributorsCreate["error"], CloudCrafterWebContributorsCreate["request"]>({
                method: "post",
                url: `/Contributors`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}