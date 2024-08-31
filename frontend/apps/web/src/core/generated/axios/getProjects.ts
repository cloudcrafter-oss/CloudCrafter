import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type {
	GetProjectsQueryParams,
	GetProjectsQueryResponse,
} from '../types/GetProjects'

/**
 * @link /api/Projects
 */
export async function getProjects(
	params?: GetProjectsQueryParams,
	options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetProjectsQueryResponse>['data']> {
	const res = await client<GetProjectsQueryResponse>({
		method: 'get',
		url: '/api/Projects',
		params,
		...options,
	})
	return res.data
}
