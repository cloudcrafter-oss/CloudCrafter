import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type { DispatchStackDeploymentMutationResponse, DispatchStackDeploymentPathParams } from '../types/DispatchStackDeployment'
import type { UseMutationOptions } from '@tanstack/react-query'
import { dispatchStackDeployment } from '../axios-backend/dispatchStackDeployment'
import { useMutation } from '@tanstack/react-query'

export const dispatchStackDeploymentMutationKey = () => [{ url: '/api/Stacks/{id}/deploy' }] as const

export type DispatchStackDeploymentMutationKey = ReturnType<typeof dispatchStackDeploymentMutationKey>

/**
 * {@link /api/Stacks/:id/deploy}
 */
export function useDispatchStackDeploymentHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      DispatchStackDeploymentMutationResponse,
      ResponseErrorConfig<Error>,
      { id: DispatchStackDeploymentPathParams['id'] },
      TContext
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? dispatchStackDeploymentMutationKey()

  return useMutation<DispatchStackDeploymentMutationResponse, ResponseErrorConfig<Error>, { id: DispatchStackDeploymentPathParams['id'] }, TContext>({
    mutationFn: async ({ id }) => {
      return dispatchStackDeployment(id, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}