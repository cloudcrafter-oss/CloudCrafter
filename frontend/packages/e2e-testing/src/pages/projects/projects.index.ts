import type { Page } from '@playwright/test'

export const ProjectListPage = (page: Page) => {
	return {
		addProjectButton: page.getByTestId('btn-new-project'),

		form: {
			name: page.getByTestId('input-project-name'),
			submitButton: page.getByTestId('btn-save-project'),
		},
	}
}
