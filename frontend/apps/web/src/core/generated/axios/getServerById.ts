import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { GetServerByIdQueryResponse, GetServerByIdPathParams } from '../types/GetServerById'

 /**
 * @link /api/Servers/:id
 */
export async function getServerById(id: GetServerByIdPathParams['id'], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetServerByIdQueryResponse>['data']> {
    const res = await client<GetServerByIdQueryResponse>({ method: 'get', url: `/api/Servers/${id}`, ...options })
    return res.data
}