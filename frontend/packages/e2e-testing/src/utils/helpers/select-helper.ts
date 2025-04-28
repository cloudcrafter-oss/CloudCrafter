import type { Page } from '@playwright/test'

export const SelectHelper = (page: Page, testPrefix: string) => {
	const selectTrigger = page.getByTestId(`${testPrefix}-select-trigger`)

	return {
		openSelector: async () => {
			await selectTrigger.click()
		},
		selectOption: async (option: string) => {
			await page.getByTestId(`${testPrefix}-select-item-${option}`).click()
		},
	}
}
