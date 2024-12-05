import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { PostCreateDeploymentMutationResponse, PostCreateDeploymentPathParams } from "../types/PostCreateDeployment";

 /**
 * @link /api/Applications/:applicationId/deployment
 */
export async function postCreateDeployment(applicationId: PostCreateDeploymentPathParams["applicationId"], config: Partial<RequestConfig> = {}) {
    const res = await client<PostCreateDeploymentMutationResponse, Error, unknown>({ method: "POST", url: `/api/Applications/${applicationId}/deployment`, ...config });
    return res.data;
}