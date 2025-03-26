import client from '@cloudcrafter/api/client'
import type { PostCreateDeploymentMutationResponse, PostCreateDeploymentPathParams } from '../types/PostCreateDeployment'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postCreateDeployment } from '../axios-backend/postCreateDeployment'
import { useMutation } from '@tanstack/react-query'

export const postCreateDeploymentMutationKey = () => [{ url: '/api/Applications/{applicationId}/deployment' }] as const

export type PostCreateDeploymentMutationKey = ReturnType<typeof postCreateDeploymentMutationKey>

/**
 * {@link /api/Applications/:applicationId/deployment}
 */
export function usePostCreateDeploymentHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PostCreateDeploymentMutationResponse,
      ResponseErrorConfig<Error>,
      { applicationId: PostCreateDeploymentPathParams['applicationId'] },
      TContext
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postCreateDeploymentMutationKey()

  return useMutation<
    PostCreateDeploymentMutationResponse,
    ResponseErrorConfig<Error>,
    { applicationId: PostCreateDeploymentPathParams['applicationId'] },
    TContext
  >({
    mutationFn: async ({ applicationId }) => {
      return postCreateDeployment(applicationId, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}