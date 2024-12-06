import { ViewServerDetail } from '@/src/core/features/admin/servers/view'
import { addBreadcrumb, resetBreadcrumbs } from '@/src/utils/breadcrumbs'
import { getServerById } from '@cloudcrafter/api'
import { notFound } from 'next/navigation'

interface PageProps {
	params: Promise<{ uuid: string }>
}

export default async function Page({ params }: PageProps) {
	const resolvedParams = await params
	const server = await getServerById(resolvedParams.uuid).catch(() => {
		return null
	})

	if (!server) {
		return notFound()
	}

	resetBreadcrumbs()
	addBreadcrumb('Admin', '/admin')
	addBreadcrumb('Servers', '/admin/servers')
	addBreadcrumb(server.name, `/admin/servers/${resolvedParams.uuid}`)

	return <ViewServerDetail server={server} />
}
