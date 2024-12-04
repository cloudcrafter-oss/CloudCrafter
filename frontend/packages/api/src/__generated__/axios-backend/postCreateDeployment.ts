import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { PostCreateDeploymentMutationResponse, PostCreateDeploymentPathParams } from "../types/PostCreateDeployment.ts";

 /**
 * @link /api/Applications/:applicationId/deployment
 */
export async function postCreateDeployment(applicationId: PostCreateDeploymentPathParams["applicationId"], config: Partial<RequestConfig> = {}) {
    const res = await client<PostCreateDeploymentMutationResponse, Error, unknown>({ method: "POST", url: `/api/Applications/${applicationId}/deployment`, ...config });
    return res.data;
}