import type { Page } from '@playwright/test'
import type { StackDetails } from '../../../fixtures/project-fixture'

export const StackDetailPage = (page: Page) => {
	return {
		environments: {
			button: page.getByTestId('subsection-environment-variables'),

			screen: {
				addVariableButton: page.getByTestId('add-variable'),

				form: {
					input: {
						key: page.getByTestId('environment-variable-key'),
						value: page.getByTestId('environment-variable-value'),
						typeSelect: page.getByTestId('environment-variable-type-select'),
						type: {
							buildTime: page.getByTestId(
								'environment-variable-type-build-time',
							),
							runtime: page.getByTestId('environment-variable-type-runtime'),
							both: page.getByTestId('environment-variable-type-both'),
						},
						description: page.getByTestId('environment-variable-description'),
					},
					submit: page.getByTestId('environment-variable-submit'),
				},
			},
		},

		url: (stack: StackDetails) =>
			`/admin/projects/${stack.project.id}/${stack.project.environments[0].id}/stack/${stack.stack.id}`,
	}
}
