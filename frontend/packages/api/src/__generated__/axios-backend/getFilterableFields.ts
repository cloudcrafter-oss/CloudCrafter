import client from "../../backend/client";
import type { RequestConfig } from "../../backend/client";
import type { GetFilterableFieldsQueryResponse } from "../types/GetFilterableFields";

 /**
 * @link /api/System/get-fields
 */
export async function getFilterableFields(config: Partial<RequestConfig> = {}) {
    const res = await client<GetFilterableFieldsQueryResponse, Error, unknown>({ method: "GET", url: `/api/System/get-fields`, ...config });
    return res.data;
}