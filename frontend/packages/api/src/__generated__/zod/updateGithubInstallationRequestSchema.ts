import { z } from 'zod'

export const updateGithubInstallationRequestSchema = z.object({
  installationId: z.number().int(),
})