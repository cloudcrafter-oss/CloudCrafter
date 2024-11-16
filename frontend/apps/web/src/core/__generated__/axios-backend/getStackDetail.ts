import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { GetStackDetailQueryResponse, GetStackDetailPathParams } from "../types/GetStackDetail";

 /**
 * @link /api/Stacks/:id
 */
export async function getStackDetail(id: GetStackDetailPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetStackDetailQueryResponse>["data"]> {
    const res = await client<GetStackDetailQueryResponse>({ method: "get", url: `/api/Stacks/${id}`, ...options });
    return res.data;
}