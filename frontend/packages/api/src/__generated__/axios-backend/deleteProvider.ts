import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { DeleteProviderMutationResponse, DeleteProviderPathParams } from "../types/DeleteProvider";

 /**
 * {@link /api/Providers/:id}
 */
export async function deleteProvider(id: DeleteProviderPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<DeleteProviderMutationResponse, Error, unknown>({ method: "DELETE", url: `/api/Providers/${id}`, ...config });
    return res.data;
}