import { updateGithubInstallationRequestSchema } from './updateGithubInstallationRequestSchema'
import { z } from 'zod'

export const putUpdateGithubProviderPathParamsSchema = z.object({
  id: z.string().uuid(),
})

/**
 * @description OK
 */
export const putUpdateGithubProvider200Schema = z.any()

export const putUpdateGithubProviderMutationRequestSchema = z.lazy(() => updateGithubInstallationRequestSchema)

export const putUpdateGithubProviderMutationResponseSchema = z.lazy(() => putUpdateGithubProvider200Schema)