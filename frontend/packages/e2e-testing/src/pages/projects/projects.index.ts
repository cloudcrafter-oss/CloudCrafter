import type { Page } from '@playwright/test'
import type { ProjectDto } from '../../__generated__'
import { SelectHelper } from '../../utils/helpers/select-helper'

export const ProjectListPage = (page: Page) => {
	return {
		addProjectButton: page.getByTestId('btn-new-project'),

		form: {
			name: page.getByTestId('input-project-name'),
			teamSelector: SelectHelper(page, 'select-team'),
			submitButton: page.getByTestId('btn-save-project'),
		},

		// Method to find a project by name and open its actions menu
		openProjectActions: async (project: ProjectDto) => {
			// Click the actions button for this project
			page.getByTestId(`btn-edit-project-${project.id}`).click()
		},

		// Actions in the project menu
		actions: {
			delete: page.getByTestId('btn-delete-project'),
			edit: page.getByTestId('btn-edit-project'),
			confirmDelete: page.getByTestId('btn-confirm-delete'),
		},
	}
}
