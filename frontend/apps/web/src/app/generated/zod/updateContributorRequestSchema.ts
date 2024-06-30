import { z } from 'zod'


export const updateContributorRequestSchema = z.object({ 'id': z.number(), 'name': z.string().min(2).max(100) })