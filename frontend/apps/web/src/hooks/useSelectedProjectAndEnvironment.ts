import type { ProjectDto } from '@/src/core/__generated__'
import { useParams } from 'next/navigation'

export function useSelectedProjectAndEnvironment(projects: ProjectDto[]) {
	const params = useParams()
	const { 'project-uuid': projectUuid, 'environment-uuid': environmentUuid } =
		params

	const selectedProject = projects.find((project) => project.id === projectUuid)

	const selectedEnvironment = selectedProject?.environments.find(
		(env) => env.id === environmentUuid,
	)

	return {
		selectedProjectId: selectedProject?.id,
		selectedEnvironmentId: selectedEnvironment?.id,
	}
}
