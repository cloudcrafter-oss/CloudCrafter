import client from '@cloudcrafter/api/client'
import type { UpdateStackMutationRequest, UpdateStackMutationResponse, UpdateStackPathParams, UpdateStack404 } from '../types/UpdateStack'
import type { RequestConfig, ResponseErrorConfig } from '@cloudcrafter/api/client'
import type { UseMutationOptions } from '@tanstack/react-query'
import { updateStack } from '../axios-backend/updateStack'
import { useMutation } from '@tanstack/react-query'

export const updateStackMutationKey = () => [{ url: '/api/Stacks/{id}' }] as const

export type UpdateStackMutationKey = ReturnType<typeof updateStackMutationKey>

/**
 * {@link /api/Stacks/:id}
 */
export function useUpdateStackHook<TContext>(
  options: {
    mutation?: UseMutationOptions<
      UpdateStackMutationResponse,
      ResponseErrorConfig<UpdateStack404>,
      { id: UpdateStackPathParams['id']; data: UpdateStackMutationRequest },
      TContext
    >
    client?: Partial<RequestConfig<UpdateStackMutationRequest>> & { client?: typeof client }
  } = {},
) {
  const { mutation: mutationOptions, client: config = {} } = options ?? {}
  const mutationKey = mutationOptions?.mutationKey ?? updateStackMutationKey()

  return useMutation<
    UpdateStackMutationResponse,
    ResponseErrorConfig<UpdateStack404>,
    { id: UpdateStackPathParams['id']; data: UpdateStackMutationRequest },
    TContext
  >({
    mutationFn: async ({ id, data }) => {
      return updateStack(id, data, config)
    },
    mutationKey,
    ...mutationOptions,
  })
}