import { expect, test } from '../../fixtures/project-fixture'
import { ProjectListPage } from '../../pages/projects/projects.index'
import { generateProjectName } from '../../utils/fake-data'

test('should navigate to a pre-created project', async ({ page, project }) => {
	// Navigate to the projects page
	await page.goto('/admin/projects')
	// Verify our test project exists in the list
	await expect(page.getByText(project.name)).toBeVisible()

	// Additional project-related tests can go here
	// Since the project was created by the fixture, it will be automatically cleaned up after the test
})

test('should be able to delete project', async ({ page, project }) => {
	// Navigate to the projects page
	await page.goto('/admin/projects')

	// Verify our test project exists in the list
	await expect(page.getByText(project.name)).toBeVisible()

	const projectListPage = ProjectListPage(page)

	// Open the sheet
	await projectListPage.openProjectActions(project)

	await projectListPage.actions.delete.click()

	// wait for "Are you sure you want to delete this project?" to see
	await expect(
		page.getByText('Are you sure you want to delete this project?'),
	).toBeVisible()

	// Click confirm
	await projectListPage.actions.confirmDelete.click()

	// wait for "Project deleted successfully" toast
	await expect(page.getByText('Project deleted successfully')).toBeVisible()
})

test('should create a new project', async ({ page }) => {
	await page.goto('/admin/projects')

	const projectListPage = ProjectListPage(page)

	// expect to see "Add project"
	await expect(projectListPage.addProjectButton).toBeVisible()

	// click on "Add project"
	await projectListPage.addProjectButton.click()

	// should see "Create a new project here. Click save when you're done"
	await expect(
		page.getByText("Create a new project here. Click save when you're done"),
	).toBeVisible()

	const newProjectName = generateProjectName()
	// fill in project name
	await projectListPage.form.name.fill(newProjectName)

	// click on "Save changes"
	await projectListPage.form.submitButton.click()

	// should see the new project in the list
	await expect(page.getByText(newProjectName)).toBeVisible()
})
