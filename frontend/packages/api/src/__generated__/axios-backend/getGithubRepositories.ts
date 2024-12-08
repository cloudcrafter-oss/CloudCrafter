import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetGithubRepositoriesQueryResponse, GetGithubRepositoriesPathParams } from "../types/GetGithubRepositories";

 /**
 * {@link /api/Providers/github/:id/repositories}
 */
export async function getGithubRepositories(id: GetGithubRepositoriesPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGithubRepositoriesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/github/${id}/repositories`, ...config });
    return res.data;
}