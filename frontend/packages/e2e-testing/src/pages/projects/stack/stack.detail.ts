import { type Page, expect } from '@playwright/test'
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

		services: {
			sectionButton: page.getByTestId('subsection-services'),
			overviewButton: page.getByTestId('subtab-overview'),

			container: (serviceId: string) => {
				const containerLocator = page.getByTestId(
					`container-service-${serviceId}`,
				)

				return {
					locator: containerLocator,
					tab: {
						general: containerLocator.getByTestId('tab-general'),
						network: containerLocator.getByTestId('tab-network'),
						storage: {
							locator: containerLocator.getByTestId('tab-storage'),
							content: {
								locator: containerLocator.getByTestId('content-storage'),
								addVolumeButton: containerLocator.getByTestId('btn-add-volume'),
								modal: {
									locator: page.getByTestId('modal-volume'),
									form: {
										name: page.getByTestId('volume-name'),
										source: page.getByTestId('volume-source'),
										target: page.getByTestId('volume-target'),
										submit: page.getByTestId('volume-submit'),
									},
								},
								editButton: (volumeId: string) =>
									page.getByTestId(`btn-edit-volume-${volumeId}`),
								deleteButton: (volumeId: string) =>
									page.getByTestId(`btn-delete-volume-${volumeId}`),
							},
						},
					},
				}
			},
		},

		goToServiceOverview: async () => {
			const services = {
				sectionButton: page.getByTestId('subsection-services'),
				overviewButton: page.getByTestId('subtab-overview'),
			}

			await expect(services.sectionButton).toBeVisible()
			await services.sectionButton.click()

			await expect(services.overviewButton).toBeVisible()
			await services.overviewButton.click()
		},

		goToEnvironmentVariables: async () => {
			const locators = {
				section: page.getByTestId('subsection-environment-variables'),
				subTab: page.getByTestId('subtab-variables'),
			}

			await expect(locators.section).toBeVisible()
			await locators.section.click()

			await expect(locators.subTab).toBeVisible()
			await locators.subTab.click()
		},

		url: (stack: StackDetails) =>
			`/admin/projects/${stack.project.id}/${stack.project.environments[0].id}/stack/${stack.stack.id}`,
	}
}
