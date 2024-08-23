import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { PatchApiProjectsIdMutationRequest, PatchApiProjectsIdMutationResponse, PatchApiProjectsIdPathParams } from '../types/PatchApiProjectsId'

 /**
 * @link /api/Projects/:id
 */
export async function patchApiProjectsId(id: PatchApiProjectsIdPathParams['id'], data?: PatchApiProjectsIdMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<PatchApiProjectsIdMutationResponse>['data']> {
    const res = await client<PatchApiProjectsIdMutationResponse, PatchApiProjectsIdMutationRequest>({ method: 'patch', url: `/api/Projects/${id}`, data, ...options })
    return res.data
}