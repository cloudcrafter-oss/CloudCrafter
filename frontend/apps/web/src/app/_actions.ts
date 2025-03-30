'use server'

import { getCurrentCloudCrafterUser } from '@/src/utils/auth'
import { type CreateProjectCommand, createProject } from '@cloudcrafter/api'

export async function createProjectAction(dto: CreateProjectCommand) {
	// TODO: Create a test that this call is only possible when logged in
	await getCurrentCloudCrafterUser()

	const result = await createProject(dto)

	return result
}
