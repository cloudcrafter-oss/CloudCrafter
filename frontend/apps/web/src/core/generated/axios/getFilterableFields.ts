import client from '../../backend/client.ts'
import type { ResponseConfig } from '../../backend/client.ts'
import type { GetFilterableFieldsQueryResponse } from '../types/GetFilterableFields'

/**
 * @link /api/System/get-fields
 */
export async function getFilterableFields(
	options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetFilterableFieldsQueryResponse>['data']> {
	const res = await client<GetFilterableFieldsQueryResponse>({
		method: 'get',
		url: '/api/System/get-fields',
		...options,
	})
	return res.data
}
