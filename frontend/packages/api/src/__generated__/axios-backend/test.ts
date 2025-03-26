import client from '@cloudcrafter/api/client'
import type { TestQueryResponse } from '../types/Test'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'

export function getTestUrl() {
  return `/api/Users/test` as const
}

/**
 * {@link /api/Users/test}
 */
export async function test(config: Partial<RequestConfig> & { client?: typeof client } = {}) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<TestQueryResponse, ResponseErrorConfig<Error>, unknown>({ method: 'GET', url: getTestUrl().toString(), ...requestConfig })
  return res.data
}