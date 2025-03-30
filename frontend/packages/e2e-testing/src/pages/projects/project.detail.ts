import type { Page } from '@playwright/test'

export const ProjectDetailPage = (page: Page) => {
	return {
		createStackButton: page.getByTestId('btn-create-stack'),
		continueButton: page.getByTestId('btn-continue'),

		form: {
			stackName: page.getByTestId('input-stack-name'),
			gitRepository: page.getByTestId('input-git-repository'),
			serverSelect: page.getByTestId('server-select'),
			serverSelectTrigger: page.getByTestId('server-select-trigger'),
			addStackButton: page.getByTestId('button-add-stack'),
			goToStackButton: page.getByTestId('btn-go-to-stack'),
		},
	}
}
