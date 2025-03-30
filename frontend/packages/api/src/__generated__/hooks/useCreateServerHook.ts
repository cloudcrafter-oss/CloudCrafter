import client from '@cloudcrafter/api/client'
import type { CreateServerMutationRequest, CreateServerMutationResponse } from '../types/CreateServer'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { createServer } from '../axios-backend/createServer'
import { useMutation } from '@tanstack/react-query'

export const createServerMutationKey = () => [{ url: '/api/Servers' }] as const

export type CreateServerMutationKey = ReturnType<typeof createServerMutationKey>

/**
 * {@link /api/Servers}
 */
export function useCreateServerHook<TContext>(
  options: {
    mutation?: UseMutationOptions<CreateServerMutationResponse, ResponseErrorConfig<Error>, { data: CreateServerMutationRequest }, TContext>
    client?: Partial<RequestConfig<CreateServerMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? createServerMutationKey()

  return useMutation<CreateServerMutationResponse, ResponseErrorConfig<Error>, { data: CreateServerMutationRequest }, TContext>({
    mutationFn: async ({ data }) => {
      return createServer(data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}