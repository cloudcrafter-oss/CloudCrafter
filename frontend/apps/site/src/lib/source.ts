import { docs } from '@/.source'
import { loader } from 'fumadocs-core/source'
import { createOpenAPI } from 'fumadocs-openapi/server'
import { icons } from 'lucide-react'
import { createElement } from 'react'

export const openapi = createOpenAPI({
	shikiOptions: {
		themes: {
			dark: 'vesper',
			light: 'vitesse-light',
		},
	},
})
export const source = loader({
	baseUrl: '/docs',
	icon(icon) {
		if (icon && icon in icons)
			return createElement(icons[icon as keyof typeof icons])
	},
	source: docs.toFumadocsSource(),
})
