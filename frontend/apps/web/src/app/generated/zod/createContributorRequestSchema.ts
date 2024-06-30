import { z } from 'zod'


export const createContributorRequestSchema = z.object({ 'name': z.string().min(2).max(100), 'phoneNumber': z.string().nullable().nullish() })