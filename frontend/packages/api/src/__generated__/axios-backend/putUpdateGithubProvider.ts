import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { PutUpdateGithubProviderMutationRequest, PutUpdateGithubProviderMutationResponse, PutUpdateGithubProviderPathParams } from "../types/PutUpdateGithubProvider";

 /**
 * {@link /api/Providers/github/:id/install}
 */
export async function putUpdateGithubProvider(id: PutUpdateGithubProviderPathParams["id"], data: PutUpdateGithubProviderMutationRequest, config: Partial<RequestConfig<PutUpdateGithubProviderMutationRequest>> = {}) {
    const res = await client<PutUpdateGithubProviderMutationResponse, Error, PutUpdateGithubProviderMutationRequest>({ method: "PUT", url: `/api/Providers/github/${id}/install`, data, headers: { "Content-Type": "application/*+json", ...config.headers }, ...config });
    return res.data;
}