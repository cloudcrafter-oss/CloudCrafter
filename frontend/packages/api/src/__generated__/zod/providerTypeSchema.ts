import { z } from 'zod'

export const providerTypeSchema = z.enum(['Unknown', 'Github'])