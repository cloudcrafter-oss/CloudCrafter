import { z } from 'zod'

export const createGithubProviderCommandSchema = z.object({
  code: z.string(),
})