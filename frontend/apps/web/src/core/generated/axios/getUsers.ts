import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { GetUsersQueryResponse, GetUsersQueryParams } from '../types/GetUsers'

 /**
 * @link /api/Users
 */
export async function getUsers(params?: GetUsersQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetUsersQueryResponse>['data']> {
    const res = await client<GetUsersQueryResponse>({ method: 'get', url: '/api/Users', params, ...options })
    return res.data
}