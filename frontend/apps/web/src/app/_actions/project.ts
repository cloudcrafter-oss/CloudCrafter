'use server'

import {
    getProject,
    getProjectPathParamsSchema,
    getProjects,
    postApiProjectsId,
    updateProjectArgsSchema
} from '@/src/core/generated'
import { actionClient } from '@/src/utils/actions/safe-action.ts'
import { z } from 'zod'


export const fetchProjectDetail = actionClient.schema(getProjectPathParamsSchema)
    .action(async ({ parsedInput: { id } }) => {
        return await getProject(id)
    })


const updateSchema = z.object({
    project: updateProjectArgsSchema,
    id: z.string().uuid()
})

export const updateProjectAction = actionClient.schema(updateSchema)
    .action(async ({ parsedInput: { id, project } }) => {
        return await postApiProjectsId(id, project)
    })


export const fetchProjectsWithEnvironments = async () => {
    return await getProjects({
        includeEnvironments: true
    })
}