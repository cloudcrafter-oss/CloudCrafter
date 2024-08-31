import { z } from 'zod'

export const gitRepositoryCheckResultDtoSchema = z.object({
	isValid: z.boolean(),
})
