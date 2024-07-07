import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { GetServersQueryResponse } from '../types/GetServers'

 /**
 * @link /api/Servers
 */
export async function getServers(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetServersQueryResponse>['data']> {
    const res = await client<GetServersQueryResponse>({ method: 'get', url: '/api/Servers', ...options })
    return res.data
}