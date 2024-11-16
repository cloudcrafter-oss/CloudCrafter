import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { PostCreateDeploymentMutationResponse, PostCreateDeploymentPathParams } from "../types/PostCreateDeployment";

 /**
 * @link /api/Applications/:applicationId/deployment
 */
export async function postCreateDeployment(applicationId: PostCreateDeploymentPathParams["applicationId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<PostCreateDeploymentMutationResponse>["data"]> {
    const res = await client<PostCreateDeploymentMutationResponse>({ method: "post", url: `/api/Applications/${applicationId}/deployment`, baseURL: "http://[::]:8080", ...options });
    return res.data;
}