'use server'

import {
	type CreateProjectCommandCommand,
	createProject,
} from '@/src/core/__generated__'
import { getCurrentCloudCrafterUser } from '@/src/utils/auth'

export async function createProjectAction(dto: CreateProjectCommandCommand) {
	// TODO: Create a test that this call is only possible when logged in
	await getCurrentCloudCrafterUser()

	const result = await createProject(dto)

	return result
}
