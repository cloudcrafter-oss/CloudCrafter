import type { APIRequestContext, Page } from '@playwright/test'
import { test as base } from './playwright-fixture'
import { UserFixture } from './user-fixture'
export * from '@playwright/test'
import { isAxiosError } from 'axios'
import type { ProjectDto } from '../__generated__'
import {
	deleteProject as apiDeleteProject,
	createProject,
} from '../__generated__'
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

		// Delete each project in reverse order (newest first)
		for (const project of [...this.projects].reverse()) {
			try {
				await apiDeleteProject(project.id, this.getApiClientConfig())
			} catch (error) {
				// Ignore 404 errors (project already deleted)
				if (isAxiosError(error) && error.response?.status === 404) {
					// Project already deleted, just continue
					continue
				}
				console.error(`Failed to clean up project ${project.name}:`, error)
			}
		}

		this.projects = []
	}

	async fixtureCreateProject(projectName: string): Promise<ProjectDto> {
		const result = await createProject(
			{ name: projectName },
			this.getApiClientConfig(),
		)

		this.projects.push(result)

		return result
	}
}

/**
 * Extend test with project fixture that provides an authenticated user and a created project
 */
export const test = base.extend<{
	project: ProjectDto
	page: Page
	projectFixture: ProjectFixture
	request: APIRequestContext
}>({
	project: async ({ browser, page, request }, use) => {
		// Create project fixture
		const projectFixture = new ProjectFixture(page, request)

		await projectFixture.loginViaApi()

		const projectName = generateProjectName()

		const project = await projectFixture.fixtureCreateProject(projectName)

		// Make fixture available for use in tests
		await use(project)

		// Clean up projects after test
		await projectFixture.cleanupProjects()
	},

	projectFixture: async ({ browser, page, request }, use) => {
		// Create project fixture
		const projectFixture = new ProjectFixture(page, request)

		await projectFixture.loginViaApi()

		// Make fixture available for use in tests
		await use(projectFixture)
	},
})
