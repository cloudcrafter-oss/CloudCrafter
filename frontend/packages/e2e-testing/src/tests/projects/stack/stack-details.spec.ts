import { expect, test } from '../../../fixtures/project-fixture'

test('should be able to see a basic stack', async ({
	page,
	projectFixture,
	stack,
}) => {
	await page.goto(
		`/admin/projects/${stack.project.id}/${stack.project.environments[0].id}/stack/${stack.stack.id}`,
	)

	await expect(page.getByText('Basic details about your Stack')).toBeVisible()
})
