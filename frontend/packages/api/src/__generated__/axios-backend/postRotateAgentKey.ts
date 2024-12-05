import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { PostRotateAgentKeyMutationResponse, PostRotateAgentKeyPathParams } from "../types/PostRotateAgentKey";

 /**
 * @link /api/Servers/:id/rotate-key
 */
export async function postRotateAgentKey(id: PostRotateAgentKeyPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<PostRotateAgentKeyMutationResponse, Error, unknown>({ method: "POST", url: `/api/Servers/${id}/rotate-key`, ...config });
    return res.data;
}