import { expect, test } from '../fixtures/project-fixture'

test.describe('Project Management', () => {
	// This test will automatically use the testProject fixture
	test('should display project details', async ({ page, testProject }) => {
		// Navigate to the project page
		await page.goto(`/projects/${testProject.id}`)

		// Verify project name is displayed
		await expect(
			page.getByRole('heading', { name: testProject.name }),
		).toBeVisible()

		// Verify project creation date is displayed (just checking format presence)
		const createdDate = new Date(testProject.createdAt).toLocaleDateString()
		await expect(page.getByText(createdDate, { exact: false })).toBeVisible()

		// Verify environment count
		await expect(page.locator('[data-testid="environment-list"]')).toBeVisible()
	})

	// Demonstration of using the createProject fixture directly
	test('should create a new project with custom name', async ({
		page,
		createProject,
	}) => {
		// Define a custom project name
		const projectName = `Custom Project ${Date.now()}`

		// Create a project with the custom name
		const project = await createProject(projectName)

		// Verify project was created with the correct name
		expect(project.name).toBe(projectName)

		// Navigate to projects page
		await page.goto('/projects')

		// Verify the new project appears in the list
		await expect(page.getByRole('link', { name: projectName })).toBeVisible()

		// Navigate to the specific project page
		await page.getByRole('link', { name: projectName }).click()

		// Verify we're on the project details page
		await expect(page.url()).toContain(`/projects/${project.id}`)
	})

	// Test that demonstrates using both authUser and project fixtures together
	test('should show project ownership information', async ({
		page,
		authUser,
		testProject,
	}) => {
		// Navigate to the project page
		await page.goto(`/projects/${testProject.id}/settings`)

		// Verify the project owner email is displayed (comes from authUser)
		await expect(page.getByText(authUser.email, { exact: false })).toBeVisible()

		// Verify other project settings are available
		await expect(
			page.getByRole('heading', { name: 'Project Settings' }),
		).toBeVisible()
		await expect(page.getByText('Delete Project')).toBeVisible()
	})
})
