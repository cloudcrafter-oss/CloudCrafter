import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetGitBranchesQueryResponse, GetGitBranchesPathParams } from "../types/GetGitBranches";

 /**
 * {@link /api/Providers/:id/branches/:repositoryId}
 */
export async function getGitBranches(id: GetGitBranchesPathParams["id"], repositoryId: GetGitBranchesPathParams["repositoryId"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetGitBranchesQueryResponse, Error, unknown>({ method: "GET", url: `/api/Providers/${id}/branches/${repositoryId}`, ...config });
    return res.data;
}