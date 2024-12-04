import client from "../../backend/client.ts";
import type { RequestConfig } from "../../backend/client.ts";
import type { GetFilterableFieldsQueryResponse } from "../types/GetFilterableFields.ts";

 /**
 * @link /api/System/get-fields
 */
export async function getFilterableFields(config: Partial<RequestConfig> = {}) {
    const res = await client<GetFilterableFieldsQueryResponse, Error, unknown>({ method: "GET", url: `/api/System/get-fields`, ...config });
    return res.data;
}