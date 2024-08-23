'use server'

import { getProject, getProjectPathParamsSchema, postApiProjectsId, updateProjectArgsSchema } from '@/src/core/generated'
import { actionClient } from '@/src/utils/actions/safe-action.ts'
import { z } from 'zod'


export const fetchProjectDetail = actionClient.schema(getProjectPathParamsSchema)
    .action(async ({ parsedInput: { id } }) => {

        const project = await getProject(id)

        return project
    })


const updateSchema = z.object({
    project: updateProjectArgsSchema,
    id: z.string().uuid()
})

export const updateProjectAction = actionClient.schema(updateSchema)
    .action(async ({ parsedInput: { id, project } }) => {


        return await postApiProjectsId(id, project)

    })

