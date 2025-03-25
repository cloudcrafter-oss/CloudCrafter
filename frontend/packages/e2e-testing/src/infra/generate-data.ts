import type { CreateProjectMutationRequest } from '@cloudcrafter/api/src/__generated__/types'

const createProject = (): CreateProjectMutationRequest => {
	return {
		name: `Project ${Date.now()}`,
	}
}

export const generatedData = {
	project: {
		createProject,
	},
}
