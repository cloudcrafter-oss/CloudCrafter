import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { TestQueryResponse } from '../types/Test'

 /**
 * @link /api/Users/test
 */
export async function test(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<TestQueryResponse>['data']> {
    const res = await client<TestQueryResponse>({ method: 'get', url: '/api/Users/test', ...options })
    return res.data
}