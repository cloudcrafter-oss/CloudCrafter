import { ViewServerDetail } from '@/src/core/features/admin/servers/view.tsx'
import { getServerById } from '@/src/core/)generated__'
import { addBreadcrumb, resetBreadcrumbs } from '@/src/utils/breadcrumbs'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { uuid: string } }) {
	const server = await getServerById(params.uuid).catch(() => {
		return null
	})

	if (!server) {
		return notFound()
	}

	resetBreadcrumbs()
	addBreadcrumb('Admin', '/admin')
	addBreadcrumb('Servers', '/admin/servers')
	addBreadcrumb(server.name, `/admin/servers/${params.uuid}`)

	return <ViewServerDetail server={server} />
}
