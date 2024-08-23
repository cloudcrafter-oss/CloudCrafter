import { z } from 'zod'


export const updateProjectPatchArgsSchema = z.object({ 'name': z.string().nullable().nullish() })