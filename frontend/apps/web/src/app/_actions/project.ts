'use server'

import { generateBackendClient } from '@/src/setup-client'
import { actionClient } from '@/src/utils/actions/safe-action'
import {
	deleteProject,
	getProject,
	getProjectPathParamsSchema,
	getProjects,
	updateProject,
	updateProjectArgsSchema,
} from '@cloudcrafter/api'
import { z } from 'zod'

const backendClient = generateBackendClient()

export const fetchProjectDetail = actionClient
	.schema(getProjectPathParamsSchema)
	.action(async ({ parsedInput: { id } }) => {
		return await getProject(id, { client: backendClient })
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
		return await updateProject(id, project, { client: backendClient })
	})

export const deleteProjectAction = actionClient
	.schema(deleteSchema)
	.action(async ({ parsedInput: { id } }) => {
		return await deleteProject(id, { client: backendClient })
	})

export const fetchProjectsWithEnvironments = async () => {
	return await getProjects(
		{
			includeEnvironments: true,
		},
		{ client: backendClient },
	)
}
