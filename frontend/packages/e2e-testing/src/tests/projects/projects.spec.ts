import { expect, test } from '../../fixtures/user-fixture'
import { ProjectListPage } from '../../pages/projects/projects.index'
import { generateProjectName } from '../../utils/fake-data'

test('should create a new project', async ({ authenticatedUser, page }) => {
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
