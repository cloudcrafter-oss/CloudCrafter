import client from '../../backend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../backend/client.ts'
import type {
  PostApplyTemplateMutationResponse,
  PostApplyTemplatePathParams,
  PostApplyTemplateQueryParams,
  PostApplyTemplate400,
} from '../types/PostApplyTemplate'

export function getPostApplyTemplateUrl(stackId: PostApplyTemplatePathParams['stackId'], templateId: PostApplyTemplatePathParams['templateId']) {
  return `/api/Stacks/${stackId}/environment-variables/templates/${templateId}/apply` as const
}

/**
 * {@link /api/Stacks/:stackId/environment-variables/templates/:templateId/apply}
 */
export async function postApplyTemplate(
  stackId: PostApplyTemplatePathParams['stackId'],
  templateId: PostApplyTemplatePathParams['templateId'],
  params?: PostApplyTemplateQueryParams,
  config: Partial<RequestConfig> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<PostApplyTemplateMutationResponse, ResponseErrorConfig<PostApplyTemplate400>, unknown>({
    method: 'POST',
    url: getPostApplyTemplateUrl(stackId, templateId).toString(),
    params,
    ...requestConfig,
  })
  return res.data
}