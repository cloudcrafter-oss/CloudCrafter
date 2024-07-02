import { z } from 'zod'


export const postLoginUserQuerySchema = z.object({ 'email': z.string(), 'password': z.string() })