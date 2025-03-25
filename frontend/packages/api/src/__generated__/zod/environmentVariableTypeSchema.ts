import { z } from 'zod'

export const environmentVariableTypeSchema = z.number().int()