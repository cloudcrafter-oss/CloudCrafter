import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { SendExampleDeploymentQueryResponse } from "../types/SendExampleDeployment";

 /**
 * @link /api/Test
 */
export async function sendExampleDeployment(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SendExampleDeploymentQueryResponse>["data"]> {
    const res = await client<SendExampleDeploymentQueryResponse>({ method: "get", url: `/api/Test`, ...options });
    return res.data;
}