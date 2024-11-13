import { z } from 'zod'

export const Http422ErrorSchema = z.object({
	type: z.string().url(),
	title: z.string(),
	status: z.literal(422),
	errors: z.record(z.string(), z.array(z.string())),
})

export type Http422Error = z.infer<typeof Http422ErrorSchema>
