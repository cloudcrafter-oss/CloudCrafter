import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { CloudCrafterWebContributorsUpdateMutationRequest, CloudCrafterWebContributorsUpdateMutationResponse, CloudCrafterWebContributorsUpdatePathParams, CloudCrafterWebContributorsUpdate400 } from "../types/CloudCrafterWebContributorsUpdate";
import type { UseMutationOptions } from "@tanstack/react-query";

 type CloudCrafterWebContributorsUpdateClient = typeof client<CloudCrafterWebContributorsUpdateMutationResponse, CloudCrafterWebContributorsUpdate400, CloudCrafterWebContributorsUpdateMutationRequest>;
type CloudCrafterWebContributorsUpdate = {
    data: CloudCrafterWebContributorsUpdateMutationResponse;
    error: CloudCrafterWebContributorsUpdate400;
    request: CloudCrafterWebContributorsUpdateMutationRequest;
    pathParams: CloudCrafterWebContributorsUpdatePathParams;
    queryParams: never;
    headerParams: never;
    response: CloudCrafterWebContributorsUpdateMutationResponse;
    client: {
        parameters: Partial<Parameters<CloudCrafterWebContributorsUpdateClient>[0]>;
        return: Awaited<ReturnType<CloudCrafterWebContributorsUpdateClient>>;
    };
};
/**
 * @description Update an existing Contributor by providing a fully defined replacement set of values.See: https://stackoverflow.com/questions/60761955/rest-update-best-practice-put-collection-id-without-id-in-body-vs-put-collecti
 * @summary Update an existing Contributor.
 * @link /Contributors/:contributorId
 */
export function useCloudCrafterWebContributorsUpdateHook(contributorId: CloudCrafterWebContributorsUpdatePathParams["contributorId"], options: {
    mutation?: UseMutationOptions<CloudCrafterWebContributorsUpdate["response"], CloudCrafterWebContributorsUpdate["error"], CloudCrafterWebContributorsUpdate["request"]>;
    client?: CloudCrafterWebContributorsUpdate["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<CloudCrafterWebContributorsUpdate["data"], CloudCrafterWebContributorsUpdate["error"], CloudCrafterWebContributorsUpdate["request"]>({
                method: "put",
                url: `/Contributors/${contributorId}`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}