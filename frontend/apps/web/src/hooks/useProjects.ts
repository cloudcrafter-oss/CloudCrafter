import useSWR from 'swr'
import { fetchProjectsWithEnvironments } from '../app/_actions/project'

export const useProjects = () => {
	const { data: projects } = useSWR(
		'userProjects',
		fetchProjectsWithEnvironments,
	)

	return {
		projects: projects || [],
	}
}
