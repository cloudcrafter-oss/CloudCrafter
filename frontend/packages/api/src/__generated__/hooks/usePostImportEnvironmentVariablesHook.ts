import client from '../../frontend/client.ts'
import type { RequestConfig, ResponseErrorConfig } from '../../frontend/client.ts'
import type {
  PostImportEnvironmentVariablesMutationResponse,
  PostImportEnvironmentVariablesPathParams,
  PostImportEnvironmentVariables400,
} from '../types/PostImportEnvironmentVariables'
import type { UseMutationOptions } from '@tanstack/react-query'
import { postImportEnvironmentVariables } from '../axios-backend/postImportEnvironmentVariables'
import { useMutation } from '@tanstack/react-query'

export const postImportEnvironmentVariablesMutationKey = () => [{ url: '/api/Stacks/{stackId}/environment-variables/import' }] as const

export type PostImportEnvironmentVariablesMutationKey = ReturnType<typeof postImportEnvironmentVariablesMutationKey>

/**
 * {@link /api/Stacks/:stackId/environment-variables/import}
 */
export function usePostImportEnvironmentVariablesHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      PostImportEnvironmentVariablesMutationResponse,
      ResponseErrorConfig<PostImportEnvironmentVariables400>,
      { stackId: PostImportEnvironmentVariablesPathParams['stackId'] },
      TContext
    >
    client?: Partial<RequestConfig> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? postImportEnvironmentVariablesMutationKey()

  return useMutation<
    PostImportEnvironmentVariablesMutationResponse,
    ResponseErrorConfig<PostImportEnvironmentVariables400>,
    { stackId: PostImportEnvironmentVariablesPathParams['stackId'] },
    TContext
  >({
    mutationFn: async ({ stackId }) => {
      return postImportEnvironmentVariables(stackId, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}