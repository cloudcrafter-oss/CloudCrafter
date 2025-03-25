import { generatedData } from '@/infra/generate-data'
import { createProject } from '@cloudcrafter/api/src/__generated__/axios-backend'
import type { ProjectDto } from '@cloudcrafter/api/src/__generated__/types'
import { test as baseTest, createAuthHeaders, expect } from './user-fixture'

// Define our test fixture type with project creation functionality
type ProjectFixture = {
	/**
	 * Create a new project and return the project data
	 */
	createProject: () => Promise<ProjectDto>

	/**
	 * A project that's created automatically for testing
	 */
	testProject: ProjectDto
}

/**
 * Extend the base test with our custom project fixture
 */
export const test = baseTest.extend<ProjectFixture>({
	// Define the createProject fixture
	createProject: async ({ authUser }, use) => {
		// Create a project creation function that can be used in tests
		const createProjectFn = async (): Promise<ProjectDto> => {
			const project = generatedData.project.createProject()
			try {
				// Create project using the API client with auth token

				const projectData = await createProject(project, {
					headers: createAuthHeaders(authUser.token),
				})

				return projectData
			} catch (error) {
				console.error('Project creation failed:', error)
				throw new Error(`Failed to create project with name: ${project.name}`)
			}
		}

		// Provide the createProject function to the test
		await use(createProjectFn)
	},

	// Define the testProject fixture which automatically creates a test project
	testProject: async ({ createProject }, use) => {
		// Create a test project
		const project = await createProject()

		// Provide the project to the test
		await use(project)

		// Optional: Clean up project after test - commented out to avoid deleting test data
		// We could add a cleanup function here if needed:
		// try {
		//   await deleteProject(project.id)
		// } catch (error) {
		//   console.warn(`Failed to clean up test project: ${project.id}`, error)
		// }
	},
})

// Re-export the expect from the base test
export { expect }
