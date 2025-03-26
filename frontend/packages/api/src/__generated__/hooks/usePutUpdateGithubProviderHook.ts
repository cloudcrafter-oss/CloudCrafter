import client from '@cloudcrafter/api/client'
import type {
  PutUpdateGithubProviderMutationRequest,
  PutUpdateGithubProviderMutationResponse,
  PutUpdateGithubProviderPathParams,
} from '../types/PutUpdateGithubProvider'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { putUpdateGithubProvider } from '../axios-backend/putUpdateGithubProvider'
import { useMutation } from '@tanstack/react-query'

export const putUpdateGithubProviderMutationKey = () => [{ url: '/api/Providers/github/{id}/install' }] as const

export type PutUpdateGithubProviderMutationKey = ReturnType<typeof putUpdateGithubProviderMutationKey>

/**
 * {@link /api/Providers/github/:id/install}
 */
export function usePutUpdateGithubProviderHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PutUpdateGithubProviderMutationResponse,
      ResponseErrorConfig<Error>,
      { id: PutUpdateGithubProviderPathParams['id']; data: PutUpdateGithubProviderMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<PutUpdateGithubProviderMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? putUpdateGithubProviderMutationKey()

  return useMutation<
    PutUpdateGithubProviderMutationResponse,
    ResponseErrorConfig<Error>,
    { id: PutUpdateGithubProviderPathParams['id']; data: PutUpdateGithubProviderMutationRequest },
    TContext
  >({
    mutationFn: async ({ id, data }) => {
      return putUpdateGithubProvider(id, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}