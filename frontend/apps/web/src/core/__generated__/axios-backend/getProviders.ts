import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { GetProvidersQueryResponse } from "../types/GetProviders";

 /**
 * @link /api/Providers
 */
export async function getProviders(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetProvidersQueryResponse>["data"]> {
    const res = await client<GetProvidersQueryResponse>({ method: "get", url: `/api/Providers`, ...options });
    return res.data;
}