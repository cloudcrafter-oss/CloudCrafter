import { z } from 'zod'


export const querySchema = z.object({ 'email': z.string().optional(), 'password': z.string().optional() })