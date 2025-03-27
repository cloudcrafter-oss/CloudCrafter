import { getProjects } from '../../__generated__'
import { expect, test } from '../../fixtures/project-fixture'

test('should be able to see project detail page', async ({
	page,
	project,
	projectFixture,
}) => {
	// fetch environment
	const client = projectFixture.getApiClientConfig()

	const projectsWithEnvironments = await getProjects(
		{ includeEnvironments: true },
		client,
	)

	// Verify our test project exists in the list
	const projectFromList = projectsWithEnvironments.find(
		(p) => p.id === project.id,
	)

	expect(projectFromList).toBeDefined()
	expect(projectFromList?.environments).toBeDefined()
	expect(projectFromList?.environments?.length).toBe(1)

	// Store environment name for later use
	const environmentName = projectFromList?.environments[0].name || ''

	// Navigate to the project detail page
	await page.goto(
		`/admin/projects/${project.id}/${projectFromList?.environments[0].id}`,
	)

	// Verify we are on the project detail page
	await expect(page.getByText(project.name)).toBeVisible()

	// Verify environment name
	await expect(page.getByTestId('environment-badge')).toContainText(
		environmentName,
	)
})
