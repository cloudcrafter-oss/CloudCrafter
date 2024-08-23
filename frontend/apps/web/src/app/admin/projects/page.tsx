'use server'
import { getProjects } from '@/src/core/generated'
import { ProjectList } from '@/src/core/features/admin/projects/project-list.tsx'

export default async function Page() {
    const projects = await getProjects()

    return <ProjectList projects={projects}/>
}