'use server'
import { getBreadcrumbs } from '@/src/utils/breadcrumbs'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from '@ui/components/ui/breadcrumb.tsx'

export const CloudcrafterBreadcrumbs = async () => {
	const breadcrumbs = await getBreadcrumbs()

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((breadcrumb, index) => (
					<>
						<BreadcrumbItem key={breadcrumb.label}>
							<BreadcrumbLink href={breadcrumb.href}>
								{breadcrumb.label}
							</BreadcrumbLink>
						</BreadcrumbItem>
						{index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
					</>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
