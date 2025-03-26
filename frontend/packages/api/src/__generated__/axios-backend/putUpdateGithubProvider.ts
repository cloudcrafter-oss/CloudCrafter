import client from '@cloudcrafter/client-auth/clients'
import type {
  PutUpdateGithubProviderMutationRequest,
  PutUpdateGithubProviderMutationResponse,
  PutUpdateGithubProviderPathParams,
} from '../types/PutUpdateGithubProvider'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/client-auth/clients'

export function getPutUpdateGithubProviderUrl(id: PutUpdateGithubProviderPathParams['id']) {
  return `/api/Providers/github/${id}/install` as const
}

/**
 * {@link /api/Providers/github/:id/install}
 */
export async function putUpdateGithubProvider(
  id: PutUpdateGithubProviderPathParams['id'],
  data: PutUpdateGithubProviderMutationRequest,
  config: Partial<RequestConfig<PutUpdateGithubProviderMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PutUpdateGithubProviderMutationResponse, ResponseErrorConfig<Error>, PutUpdateGithubProviderMutationRequest>({
    method: 'PUT',
    url: getPutUpdateGithubProviderUrl(id).toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}