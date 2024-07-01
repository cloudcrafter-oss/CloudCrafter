import { z } from 'zod'


export const querySchema = z.object({ 'email': z.string(), 'password': z.string() })