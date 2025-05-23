import client from '@kubb/plugin-client/clients/axios'
import type {
  PostCreateStackFromSourceProviderMutationRequest,
  PostCreateStackFromSourceProviderMutationResponse,
} from '../types/PostCreateStackFromSourceProvider'
import type { RequestConfig, ResponseErrorConfig } from '@kubb/plugin-client/clients/axios'

export function getPostCreateStackFromSourceProviderUrl() {
  return `/api/Stacks/provider` as const
}

/**
 * {@link /api/Stacks/provider}
 */
export async function postCreateStackFromSourceProvider(
  data: PostCreateStackFromSourceProviderMutationRequest,
  config: Partial<RequestConfig<PostCreateStackFromSourceProviderMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostCreateStackFromSourceProviderMutationResponse, ResponseErrorConfig<Error>, PostCreateStackFromSourceProviderMutationRequest>({
    method: 'POST',
    url: getPostCreateStackFromSourceProviderUrl().toString(),
    data,
    ...requestConfig,
    headers: { 'Content-Type': 'application/*+json', ...requestConfig.headers },
  })
  return res.data
}