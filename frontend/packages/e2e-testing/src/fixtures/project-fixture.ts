// create a fixture that uses the user-fixture as a base, and allows to create a project

import { createProject } from '@cloudcrafter/api/src/__generated__/axios-backend'
import type { ProjectDto } from '@cloudcrafter/api/src/__generated__/types'
import { test as baseTest, createAuthHeaders, expect } from './user-fixture'

// Define our test fixture type with project creation functionality
type ProjectFixture = {
	/**
	 * Create a new project and return the project data
	 */
	createProject: (name: string) => Promise<ProjectDto>

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
		const createProjectFn = async (name: string): Promise<ProjectDto> => {
			try {
				// Create project using the API client with auth token
				const projectData = await createProject(
					{ name },
					{
						headers: createAuthHeaders(authUser.token),
					},
				)

				return projectData
			} catch (error) {
				console.error('Project creation failed:', error)
				throw new Error(`Failed to create project with name: ${name}`)
			}
		}

		// Provide the createProject function to the test
		await use(createProjectFn)
	},

	// Define the testProject fixture which automatically creates a test project
	testProject: async ({ createProject }, use) => {
		// Generate a unique project name
		const projectName = `Test Project ${new Date().toISOString()}`

		// Create a test project
		const project = await createProject(projectName)

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
