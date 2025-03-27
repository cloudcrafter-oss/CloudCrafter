import { z } from 'zod'

export const tokenDtoSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  refreshTokenExpires: z.string().datetime(),
  refreshTokenExpiresIn: z.number().int(),
})