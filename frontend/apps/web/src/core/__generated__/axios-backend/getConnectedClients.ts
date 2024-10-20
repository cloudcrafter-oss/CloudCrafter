import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { GetConnectedClientsQueryResponse } from "../types/GetConnectedClients";

 /**
 * @link /api/Test/connected-clients
 */
export async function getConnectedClients(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetConnectedClientsQueryResponse>["data"]> {
    const res = await client<GetConnectedClientsQueryResponse>({ method: "get", url: `/api/Test/connected-clients`, ...options });
    return res.data;
}