import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from "../types/GetServerById";

 /**
 * @link /api/Servers/:id
 */
export async function getServerById(id: GetServerByIdPathParams["id"], config: Partial<RequestConfig> = {}) {
    const res = await client<GetServerByIdQueryResponse, Error, unknown>({ method: "GET", url: `/api/Servers/${id}`, ...config });
    return res.data;
}