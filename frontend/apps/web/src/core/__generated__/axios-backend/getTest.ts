import client from "../../backend/client.ts";
import type { ResponseConfig } from "../../backend/client.ts";
import type { GetTestMutationRequest, GetTestMutationResponse } from "../types/GetTest";

 /**
 * @link /api/Test
 */
export async function getTest(data: GetTestMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetTestMutationResponse>["data"]> {
    const res = await client<GetTestMutationResponse, GetTestMutationRequest>({ method: "post", url: `/api/Test`, data, ...options });
    return res.data;
}