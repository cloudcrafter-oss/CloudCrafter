import { useGetGitBranchesHook } from '@cloudcrafter/api'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
import { Loader2 } from 'lucide-react'

export const GitBranchesList = ({
	providerId,
	repositoryId,
	selectedBranchName,
	setSelectedBranchName,
}: {
	providerId: string
	repositoryId: string
	selectedBranchName: string
	setSelectedBranchName: (name: string) => void
}) => {
	const { data, isLoading } = useGetGitBranchesHook(providerId, repositoryId)

	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-4'>
				<Loader2 className='h-6 w-6 animate-spin' />
				Loading branches...
			</div>
		)
	}

	return (
		<Select value={selectedBranchName} onValueChange={setSelectedBranchName}>
			<SelectTrigger>
				<SelectValue placeholder='Select a branch' />
			</SelectTrigger>
			<SelectContent>
				{data?.map((branch) => (
					<SelectItem key={branch.name} value={branch.name}>
						{branch.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
