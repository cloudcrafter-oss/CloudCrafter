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
	setSelectedRepositoryId,
}: {
	providerId: string
	selectedRepositoryId: string
	setSelectedRepositoryId: (id: string) => void
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
			onValueChange={setSelectedRepositoryId}
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
