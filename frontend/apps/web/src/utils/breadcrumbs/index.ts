import { cache } from 'react'

export type Breadcrumb = {
	label: string
	href: string
}

let breadcrumbs: Breadcrumb[] = []

export const getBreadcrumbs = cache(() => breadcrumbs)

export const addBreadcrumb = (label: string, href: string) => {
	breadcrumbs = [...breadcrumbs, { label, href }]
}

export const resetBreadcrumbs = () => {
	breadcrumbs = []
}
