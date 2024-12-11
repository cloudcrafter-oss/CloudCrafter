import { useGetGitRepositoriesHook } from '@cloudcrafter/api'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export const GitRepositoriesList = ({ providerId }: { providerId: string }) => {
	const { data, isLoading } = useGetGitRepositoriesHook(providerId)

	const [selectedId, setSelectedId] = useState<string>()

	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-4'>
				<Loader2 className='h-6 w-6 animate-spin' />
			</div>
		)
	}

	return (
		<Select value={selectedId} onValueChange={setSelectedId}>
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
