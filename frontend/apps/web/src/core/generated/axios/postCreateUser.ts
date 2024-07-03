import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { PostCreateUserMutationRequest, PostCreateUserMutationResponse } from '../types/PostCreateUser'

 /**
 * @link /api/Auth/create
 */
export async function postCreateUser(data: PostCreateUserMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<PostCreateUserMutationResponse>['data']> {
    const res = await client<PostCreateUserMutationResponse, PostCreateUserMutationRequest>({ method: 'post', url: '/api/Auth/create', data, ...options })
    return res.data
}