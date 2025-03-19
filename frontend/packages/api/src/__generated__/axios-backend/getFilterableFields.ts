import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type { GetFilterableFieldsQueryResponse } from '../types/GetFilterableFields'

export function getGetFilterableFieldsUrl() {
  return `/api/System/get-fields` as const
}

/**
 * {@link /api/System/get-fields}
 */
export async function getFilterableFields(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<GetFilterableFieldsQueryResponse, ResponseErrorConfig<Error>, unknown>({
    method: 'GET',
    url: getGetFilterableFieldsUrl().toString(),
    ...requestConfig,
  })
  return res.data
}