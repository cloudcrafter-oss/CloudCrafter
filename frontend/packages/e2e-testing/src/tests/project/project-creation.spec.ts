import { expect, test } from '../../fixtures/project-fixture'

test.describe('Project Creation and Management', () => {
	// Test using the automatic testProject fixture
	test('should display existing project details', async ({
		page,
		testProject,
	}) => {
		// Navigate to the projects list page
		await page.goto('/projects')

		// Navigate to specific project - we expect the project is listed
		const projectCard = page.getByRole('link', { name: testProject.name })
		await expect(projectCard).toBeVisible()

		// Click on the project to view details
		await projectCard.click()

		// Verify we're on the correct project page
		await expect(page).toHaveURL(new RegExp(`/projects/${testProject.id}`))

		// Verify project details are displayed
		await expect(
			page.getByRole('heading', { name: testProject.name }),
		).toBeVisible()
		await expect(page.getByText(testProject.description || '')).toBeVisible({
			timeout: 5000,
		})
	})

	// Test creating a new project
	test('should create a new project', async ({ page, createProject }) => {
		// Navigate to projects page
		await page.goto('/projects')

		// Record the number of projects before creating a new one
		const initialProjectCount = await page
			.locator('[data-testid="project-card"]')
			.count()

		// Create a new project using the fixture
		const newProject = await createProject()

		// Reload the page to see the new project
		await page.reload()

		// Verify new project appears in the list
		await expect(page.getByText(newProject.name)).toBeVisible()

		// Verify project count increased by 1
		const newProjectCount = await page
			.locator('[data-testid="project-card"]')
			.count()
		expect(newProjectCount).toBe(initialProjectCount + 1)

		// Click on the new project
		await page.getByText(newProject.name).click()

		// Verify we're on the new project page
		await expect(page).toHaveURL(new RegExp(`/projects/${newProject.id}`))
	})

	// Test creating multiple projects in a single test
	test('should allow creating multiple projects', async ({
		page,
		createProject,
	}) => {
		// Create two projects
		const project1 = await createProject()
		const project2 = await createProject()

		// Verify they have different IDs and names
		expect(project1.id).not.toBe(project2.id)
		expect(project1.name).not.toBe(project2.name)

		// Navigate to the first project
		await page.goto(`/projects/${project1.id}`)
		await expect(
			page.getByRole('heading', { name: project1.name }),
		).toBeVisible()

		// Navigate to the second project
		await page.goto(`/projects/${project2.id}`)
		await expect(
			page.getByRole('heading', { name: project2.name }),
		).toBeVisible()
	})

	// Test project environment list
	test('should display project environments', async ({ page, testProject }) => {
		// Navigate to the test project
		await page.goto(`/projects/${testProject.id}/environments`)

		// Verify environments section is visible
		await expect(
			page.getByRole('heading', { name: /environments/i }),
		).toBeVisible()

		// Verify each environment is displayed
		for (const env of testProject.environments) {
			await expect(page.getByText(env.name)).toBeVisible()
		}
	})
})
