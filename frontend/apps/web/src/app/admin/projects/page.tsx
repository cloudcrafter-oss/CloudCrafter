'use server'
import { ProjectList } from '@/src/core/features/admin/projects/project-list.tsx'
import { getProjects } from '@/src/core/generated'

export default async function Page() {
	const projects = await getProjects()

	return <ProjectList projects={projects} />
}
