import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { PostDispatchStackDeploymentMutationResponse, PostDispatchStackDeploymentPathParams } from '../types/PostDispatchStackDeployment'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postDispatchStackDeployment } from '../axios-backend/postDispatchStackDeployment'
import { useMutation } from '@tanstack/react-query'

export const postDispatchStackDeploymentMutationKey = () => [{ url: '/api/Stacks/{id}/deploy' }] as const

export type PostDispatchStackDeploymentMutationKey = ReturnType<typeof postDispatchStackDeploymentMutationKey>

/**
 * {@link /api/Stacks/:id/deploy}
 */
export function usePostDispatchStackDeploymentHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PostDispatchStackDeploymentMutationResponse,
      ResponseErrorConfig<Error>,
      { id: PostDispatchStackDeploymentPathParams['id'] },
      TContext
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postDispatchStackDeploymentMutationKey()

  return useMutation<PostDispatchStackDeploymentMutationResponse, ResponseErrorConfig<Error>, { id: PostDispatchStackDeploymentPathParams['id'] }, TContext>({
    mutationFn: async ({ id }) => {
      return postDispatchStackDeployment(id, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}