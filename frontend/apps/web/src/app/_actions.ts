'use server'

import { getCurrentCloudCrafterUser } from '@/src/utils/auth'
import { createProject } from '@cloudcrafter/api'
import type { CreateProjectCommandCommand } from '@cloudcrafter/api'

export async function createProjectAction(dto: CreateProjectCommandCommand) {
	// TODO: Create a test that this call is only possible when logged in
	await getCurrentCloudCrafterUser()

	const result = await createProject(dto)

	return result
}
