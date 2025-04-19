import useSWR from 'swr'
import { fetchTeamsWithProjectsAndEnvironments } from '../app/_actions/project'

export const useTeams = () => {
	const { data: teams } = useSWR(
		'userTeams',
		fetchTeamsWithProjectsAndEnvironments,
	)

	return {
		teams: teams || [],
	}
}
