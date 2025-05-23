import { z } from 'zod'

export const updateServerDtoSchema = z.object({
  name: z.string().nullable().nullish(),
  dockerNetwork: z.string().nullable().nullish(),
})