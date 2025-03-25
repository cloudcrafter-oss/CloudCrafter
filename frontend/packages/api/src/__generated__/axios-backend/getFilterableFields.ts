import client from '@cloudcrafter/client-auth/clients'
import type { GetFilterableFieldsQueryResponse } from '../types/GetFilterableFields'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

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