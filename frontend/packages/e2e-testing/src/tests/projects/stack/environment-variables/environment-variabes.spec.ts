import { expect, test } from '../../../../fixtures/project-fixture'
import { StackDetailPage } from '../../../../pages/projects/stack/stack.detail'

test('should be able to see environment variables', async ({ page, stack }) => {
	const stackPage = StackDetailPage(page)

	await page.goto(stackPage.url(stack))

	await expect(stackPage.environments.button).toBeVisible()
	await stackPage.environments.button.click()

	await expect(page.getByText('No environment variables found')).toBeVisible()
})

test('should be able to create environment variable', async ({
	page,
	stack,
}) => {
	const stackPage = StackDetailPage(page)

	await page.goto(stackPage.url(stack))

	await expect(stackPage.environments.button).toBeVisible()
	await stackPage.environments.button.click()

	await stackPage.environments.screen.addVariableButton.click()

	await expect(
		page.getByText('Add a new environment variable to this stack.'),
	).toBeVisible()

	await expect(stackPage.environments.screen.form.input.key).toBeVisible()

	await stackPage.environments.screen.form.input.key.fill('TEST_KEY')

	await expect(stackPage.environments.screen.form.input.value).toBeVisible()

	await stackPage.environments.screen.form.input.value.fill('TEST_VALUE')

	await stackPage.environments.screen.form.input.typeSelect.click()

	await stackPage.environments.screen.form.input.type.buildTime.click()

	await stackPage.environments.screen.form.input.description.fill(
		'Test description',
	)

	await stackPage.environments.screen.form.submit.click()

	await expect(
		page.getByText('Environment variable created successfully'),
	).toBeVisible()
})
