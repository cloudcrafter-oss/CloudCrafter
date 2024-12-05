'use server'
import { ProjectList } from '@/src/core/features/admin/projects/project-list.tsx'
import { getProjects } from '@cloudcrafter/api/__generated__/axios-backend'

export default async function Page() {
	const projects = await getProjects()

	return <ProjectList projects={projects} />
}
