import { z } from 'zod'

export const problemDetailsSchema = z.object({
  type: z.string().nullable().nullish(),
  title: z.string().nullable().nullish(),
  status: z.number().int().nullable().nullish(),
  detail: z.string().nullable().nullish(),
  instance: z.string().nullable().nullish(),
})