import { type ConsoleMessage, test as base, expect } from '@playwright/test'

export const test = base.extend({
	page: async ({ page }, use) => {
		const messages: ConsoleMessage[] = []
		page.on('console', (m: ConsoleMessage) => messages.push(m))

		page.on('console', (msg) => {
			if (msg.type() === 'error') console.log(`Error text: "${msg.text()}"`)
		})

		await use(page)

		const humanFriendlyErrorMessages = messages
			.filter((m) => m.type() === 'error')
			.filter(
				(m) =>
					!m
						.text()
						.includes(
							'Failed to start the connection: Error: The connection was stopped during negotiation',
						),
			)
			.map((m) => m.text())
		expect(humanFriendlyErrorMessages).toEqual([])
	},
})
