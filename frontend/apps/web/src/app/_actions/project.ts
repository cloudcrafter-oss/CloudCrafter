'use server'

import { actionClient } from '@/src/utils/actions/safe-action'
import {
	deleteProject,
	getProject,
	getProjects,
	updateProject,
} from '@cloudcrafter/api'
import {
	getProjectPathParamsSchema,
	updateProjectArgsSchema,
} from '@cloudcrafter/api'
import { z } from 'zod'

export const fetchProjectDetail = actionClient
	.schema(getProjectPathParamsSchema)
	.action(async ({ parsedInput: { id } }) => {
		return await getProject(id)
	})

const updateSchema = z.object({
	project: updateProjectArgsSchema,
	id: z.string().uuid(),
})

const deleteSchema = z.object({
	id: z.string().uuid(),
})

export const updateProjectAction = actionClient
	.schema(updateSchema)
	.action(async ({ parsedInput: { id, project } }) => {
		return await updateProject(id, project)
	})

export const deleteProjectAction = actionClient
	.schema(deleteSchema)
	.action(async ({ parsedInput: { id } }) => {
		return await deleteProject(id)
	})

export const fetchProjectsWithEnvironments = async () => {
	return await getProjects({
		includeEnvironments: true,
	})
}
