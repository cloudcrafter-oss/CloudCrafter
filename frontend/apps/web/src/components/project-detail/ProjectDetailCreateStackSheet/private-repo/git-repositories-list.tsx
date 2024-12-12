import { useGetGitRepositoriesHook } from '@cloudcrafter/api'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
import { Loader2 } from 'lucide-react'

export const GitRepositoriesList = ({
	providerId,
	selectedRepositoryId,
	onRepositorySelect,
}: {
	providerId: string
	selectedRepositoryId: string
	onRepositorySelect: (id: string, name: string) => void
}) => {
	const { data, isLoading } = useGetGitRepositoriesHook(providerId)

	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-4'>
				<Loader2 className='h-6 w-6 animate-spin' />
				Loading repositories...
			</div>
		)
	}

	return (
		<Select
			value={selectedRepositoryId}
			onValueChange={(id) => {
				const repository = data?.find((repo) => repo.id.toString() === id)
				if (repository) {
					onRepositorySelect(id, repository.fullName)
				}
			}}
		>
			<SelectTrigger>
				<SelectValue placeholder='Select a repository' />
			</SelectTrigger>
			<SelectContent>
				{data?.map((repo) => (
					<SelectItem key={repo.id} value={repo.id.toString()}>
						{repo.fullName}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
