import { type ConsoleMessage, test as base, expect } from '@playwright/test'

export const test = base.extend({
	page: async ({ page }, use) => {
		const messages: ConsoleMessage[] = []
		page.on('console', (m: ConsoleMessage) => messages.push(m))
		await use(page)

		const humanFriendlyErrorMessages = messages
			.filter((m) => m.type() === 'error')
			.map((m) => m.text())
		expect(humanFriendlyErrorMessages).toEqual([])
	},
})
