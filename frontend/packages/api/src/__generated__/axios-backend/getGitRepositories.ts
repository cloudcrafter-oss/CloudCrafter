import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetGitRepositoriesQueryResponse, GetGitRepositoriesPathParams } from "../types/GetGitRepositories";

 /**
 * {@link /api/Providers/:id/repositories}
 */
export async function getGitRepositories(id: GetGitRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGitRepositoriesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/${id}/repositories`, ...config });
    return res.data;
}