import { getProjects, getServers } from '../../../__generated__'
import { expect, test } from '../../../fixtures/project-fixture'
import { ProjectDetailPage } from '../../../pages/projects/project.detail'
import { generateStackName } from '../../../utils/fake-data'

test('should be able to create a basic stack', async ({
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

	// Store environment name for later use
	const environmentName = projectFromList?.environments[0].name || ''

	// Navigate to the project detail page
	await page.goto(
		`/admin/projects/${project.id}/${projectFromList?.environments[0].id}`,
	)

	// Verify we are on the project detail page
	await expect(page.getByText(project.name)).toBeVisible()

	const projectPage = ProjectDetailPage(page)

	// Verify create stack button is visible
	await expect(projectPage.createStackButton).toBeVisible()

	// Click the create stack button
	await projectPage.createStackButton.click()

	// verify that "Choose your repository source" is visible
	await expect(page.getByText('Choose your repository source')).toBeVisible()

	// Option public git repo should be visible
	await expect(page.getByText('Use a public Git repository')).toBeVisible()

	// Click the public git repo option
	await projectPage.continueButton.click()

	await expect(
		page.getByText('Enter the details for your new Stack'),
	).toBeVisible()

	await projectPage.form.addStackButton.click()

	await expect(
		page.getByText('String must contain at least 3 character(s)'),
	).toBeVisible()

	const stackName = generateStackName()

	// Enter stack name
	await projectPage.form.stackName.fill(stackName)

	await expect(
		page.getByText('String must contain at least 3 character(s)'),
	).toBeHidden()

	// Enter git repository
	await projectPage.form.gitRepository.fill(
		'https://github.com/cloudcrafter-oss/demo-example',
	)

	// Validate repository
	await projectPage.form.gitRepository.blur()

	await expect(
		page.getByText('The provided Git repository is not valid'),
	).toBeVisible()

	await projectPage.form.gitRepository.fill(
		'https://github.com/cloudcrafter-oss/demo-examples',
	)

	// Validate repository
	await projectPage.form.gitRepository.blur()

	await expect(
		page.getByText('The provided Git repository is not valid'),
	).toBeHidden()

	const allServers = await getServers(client)

	const server = allServers[0]

	// Select server
	await projectPage.form.serverSelectTrigger.click()

	await page.getByTestId(`server-select-item-${server.id}`).click()

	await projectPage.form.addStackButton.click()

	await expect(page.getByText('Stack created successfully')).toBeVisible()

	// Verify that the "Go to Stack" button is visible
	await expect(projectPage.form.goToStackButton).toBeVisible()

	// Click the "Go to Stack" button
	await projectPage.form.goToStackButton.click()

	// Verify that we are on the stack detail page
	await expect(page.getByText('Basic details about your Stack')).toBeVisible()
})
