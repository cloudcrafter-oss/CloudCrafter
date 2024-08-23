import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { PostApiProjectsIdMutationRequest, PostApiProjectsIdMutationResponse, PostApiProjectsIdPathParams } from '../types/PostApiProjectsId'

 /**
 * @link /api/Projects/:id
 */
export async function postApiProjectsId(id: PostApiProjectsIdPathParams['id'], data?: PostApiProjectsIdMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<PostApiProjectsIdMutationResponse>['data']> {
    const res = await client<PostApiProjectsIdMutationResponse, PostApiProjectsIdMutationRequest>({ method: 'post', url: `/api/Projects/${id}`, data, ...options })
    return res.data
}