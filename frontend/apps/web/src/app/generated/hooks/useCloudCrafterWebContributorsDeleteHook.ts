import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { CloudCrafterWebContributorsDeleteMutationResponse, CloudCrafterWebContributorsDeletePathParams, CloudCrafterWebContributorsDelete400 } from "../types/CloudCrafterWebContributorsDelete";
import type { UseMutationOptions } from "@tanstack/react-query";

 type CloudCrafterWebContributorsDeleteClient = typeof client<CloudCrafterWebContributorsDeleteMutationResponse, CloudCrafterWebContributorsDelete400, never>;
type CloudCrafterWebContributorsDelete = {
    data: CloudCrafterWebContributorsDeleteMutationResponse;
    error: CloudCrafterWebContributorsDelete400;
    request: never;
    pathParams: CloudCrafterWebContributorsDeletePathParams;
    queryParams: never;
    headerParams: never;
    response: CloudCrafterWebContributorsDeleteMutationResponse;
    client: {
        parameters: Partial<Parameters<CloudCrafterWebContributorsDeleteClient>[0]>;
        return: Awaited<ReturnType<CloudCrafterWebContributorsDeleteClient>>;
    };
};
/**
 * @description Delete a Contributor by providing a valid integer id.
 * @summary Delete a Contributor.
 * @link /Contributors/:contributorId
 */
export function useCloudCrafterWebContributorsDeleteHook(contributorId: CloudCrafterWebContributorsDeletePathParams["contributorId"], options: {
    mutation?: UseMutationOptions<CloudCrafterWebContributorsDelete["response"], CloudCrafterWebContributorsDelete["error"], CloudCrafterWebContributorsDelete["request"]>;
    client?: CloudCrafterWebContributorsDelete["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async () => {
            const res = await client<CloudCrafterWebContributorsDelete["data"], CloudCrafterWebContributorsDelete["error"], CloudCrafterWebContributorsDelete["request"]>({
                method: "delete",
                url: `/Contributors/${contributorId}`,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}