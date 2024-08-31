import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type {
	GetProjectPathParams,
	GetProjectQueryResponse,
} from '../types/GetProject'

/**
 * @link /api/Projects/:id
 */
export async function getProject(
	id: GetProjectPathParams['id'],
	options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetProjectQueryResponse>['data']> {
	const res = await client<GetProjectQueryResponse>({
		method: 'get',
		url: `/api/Projects/${id}`,
		...options,
	})
	return res.data
}
