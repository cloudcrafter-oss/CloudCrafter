import { test as base } from '@playwright/test'
import type { APIRequestContext, Page } from '@playwright/test'
import { UserFixture } from './user-fixture'
export * from '@playwright/test'
import type { ProjectDto } from '@cloudcrafter/api'
import { ProjectListPage } from '../pages/projects/projects.index'
import { generateProjectName } from '../utils/fake-data'

/**
 * Project fixture that extends UserFixture with project creation capabilities
 */
export class ProjectFixture extends UserFixture {
	projects: ProjectDto[] = []

	/**
	 * Delete a project via UI
	 * @param projectName Name of the project to delete
	 */
	async deleteProject(projectName: string): Promise<void> {
		// Go to projects page
		await this.page.goto('/admin/projects')

		const projectListPage = ProjectListPage(this.page)

		// Open project actions menu
		await projectListPage.openProjectActions(projectName)

		// Click delete
		await projectListPage.actions.delete.click()

		// Confirm deletion
		await projectListPage.confirmDelete.click()

		// Remove from tracked projects
		this.projects = this.projects.filter((p) => p.name !== projectName)
	}

	/**
	 * Clean up all created projects
	 */
	async cleanupProjects(): Promise<void> {
		if (this.projects.length === 0) return

		// Go to projects page
		await this.page.goto('/admin/projects')

		const projectListPage = ProjectListPage(this.page)

		// Delete each project in reverse order (newest first)
		for (const project of [...this.projects].reverse()) {
			try {
				// Open project actions menu
				await projectListPage.openProjectActions(project.name)

				// Click delete
				await projectListPage.actions.delete.click()

				// Confirm deletion
				await projectListPage.confirmDelete.click()

				// Wait for project to be removed
				await this.page
					.getByText(project.name)
					.waitFor({ state: 'detached', timeout: 5000 })
			} catch (error) {
				console.error(`Failed to clean up project ${project.name}:`, error)
			}
		}

		this.projects = []
	}
}

/**
 * Extend test with project fixture that provides an authenticated user and a created project
 */
export const test = base.extend<{
	project: ProjectDto
	page: Page
	request: APIRequestContext
}>({
	project: async ({ browser, page, request }, use) => {
		// Create browser context with storage state isolation
		const context = await browser.newContext()

		// Create project fixture
		const projectFixture = new ProjectFixture(context, page, request)

		await projectFixture.loginViaApi()

		const projectName = generateProjectName()

		const project = await projectFixture.fixtureCreateProject(projectName)

		// Make fixture available for use in tests
		await use(project)

		// Clean up projects after test
		await projectFixture.cleanupProjects()
	},
})
