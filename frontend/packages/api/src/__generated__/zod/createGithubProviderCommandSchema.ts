import { z } from 'zod'

export const createGithubProviderCommandSchema = z.object({
  code: z.string(),
  teamId: z.string().uuid().nullable().nullish(),
})