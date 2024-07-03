import { z } from 'zod'


export const postRefreshUserTokensQuerySchema = z.object({ 'refreshToken': z.string() })