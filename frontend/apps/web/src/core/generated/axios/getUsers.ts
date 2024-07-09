import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { GetUsersMutationRequest, GetUsersMutationResponse } from '../types/GetUsers'

 /**
 * @link /api/Users
 */
export async function getUsers(data: GetUsersMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetUsersMutationResponse>['data']> {
    const res = await client<GetUsersMutationResponse, GetUsersMutationRequest>({ method: 'post', url: '/api/Users', data, ...options })
    return res.data
}