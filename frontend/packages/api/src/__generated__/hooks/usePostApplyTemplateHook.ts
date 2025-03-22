import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  PostApplyTemplateMutationResponse,
  PostApplyTemplatePathParams,
  PostApplyTemplateQueryParams,
  PostApplyTemplate400,
} from '../types/PostApplyTemplate'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postApplyTemplate } from '../axios-backend/postApplyTemplate'
import { useMutation } from '@tanstack/react-query'

export const postApplyTemplateMutationKey = () => [{ url: '/api/Stacks/{stackId}/environment-variables/templates/{templateId}/apply' }] as const

export type PostApplyTemplateMutationKey = ReturnType<typeof postApplyTemplateMutationKey>

/**
 * {@link /api/Stacks/:stackId/environment-variables/templates/:templateId/apply}
 */
export function usePostApplyTemplateHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PostApplyTemplateMutationResponse,
      ResponseErrorConfig<PostApplyTemplate400>,
      { stackId: PostApplyTemplatePathParams['stackId']; templateId: PostApplyTemplatePathParams['templateId']; params?: PostApplyTemplateQueryParams },
      TContext
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postApplyTemplateMutationKey()

  return useMutation<
    PostApplyTemplateMutationResponse,
    ResponseErrorConfig<PostApplyTemplate400>,
    { stackId: PostApplyTemplatePathParams['stackId']; templateId: PostApplyTemplatePathParams['templateId']; params?: PostApplyTemplateQueryParams },
    TContext
  >({
    mutationFn: async ({ stackId, templateId, params }) => {
      return postApplyTemplate(stackId, templateId, params, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}