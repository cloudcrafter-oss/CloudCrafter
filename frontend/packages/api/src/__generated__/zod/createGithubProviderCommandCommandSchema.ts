import { z } from 'zod'

export const createGithubProviderCommandCommandSchema = z.object({
  code: z.string(),
})