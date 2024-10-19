import { useParams } from 'next/navigation'
import { useProjects } from './useProjects'

export function useSelectedProjectAndEnvironment() {
	const { projects } = useProjects()

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

		selectedProject,
		selectedEnvironment,
	}
}
