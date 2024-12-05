import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetStackDetailQueryResponse, GetStackDetailPathParams, GetStackDetail404 } from "../types/GetStackDetail";

 /**
 * {@link /api/Stacks/:id}
 */
export async function getStackDetail(id: GetStackDetailPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetStackDetailQueryResponse, GetStackDetail404, unknown>({ method: "GET", url: `/api/Stacks/${id}`, ...config });
    return res.data;
}