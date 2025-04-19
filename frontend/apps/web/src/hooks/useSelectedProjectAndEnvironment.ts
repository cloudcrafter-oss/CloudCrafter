import { useParams } from 'next/navigation'
import { useTeams } from './useProjects'

export function useSelectedProjectAndEnvironment() {
	const { teams } = useTeams()

	const params = useParams()
	const { 'project-uuid': projectUuid, 'environment-uuid': environmentUuid } =
		params

	const selectedProject = teams
		.flatMap((team) => team.projects)
		.find((project) => project.id === projectUuid)

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
