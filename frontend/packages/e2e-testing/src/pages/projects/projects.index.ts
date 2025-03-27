import type { Page } from '@playwright/test'

export const ProjectListPage = (page: Page) => {
	return {
		addProjectButton: page.getByTestId('btn-new-project'),

		form: {
			name: page.getByTestId('input-project-name'),
			submitButton: page.getByTestId('btn-save-project'),
		},

		// Method to find a project by name and open its actions menu
		openProjectActions: async (projectName: string) => {
			// Find the project row that contains the specified name
			const projectRow = page
				.getByText(projectName)
				.locator('..')
				.filter({ hasText: projectName })

			// Click the actions button for this project
			await projectRow.getByTestId('btn-project-actions').click()
		},

		// Actions in the project menu
		actions: {
			delete: page.getByTestId('btn-delete-project'),
			edit: page.getByTestId('btn-edit-project'),
		},

		// Confirm deletion in dialog
		confirmDelete: page.getByTestId('btn-confirm-delete'),
	}
}
