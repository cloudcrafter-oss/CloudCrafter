import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { PostLoginUserMutationRequest, PostLoginUserMutationResponse } from '../types/PostLoginUser'

 /**
 * @link /api/Auth/login
 */
export async function postLoginUser(data: PostLoginUserMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<PostLoginUserMutationResponse>['data']> {
    const res = await client<PostLoginUserMutationResponse, PostLoginUserMutationRequest>({ method: 'post', url: '/api/Auth/login', data, ...options })
    return res.data
}