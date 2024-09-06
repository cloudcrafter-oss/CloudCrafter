import {
	type StackDetailDto,
	useDispatchStackDeploymentHook,
} from '@/src/core/__generated__'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@ui/components/ui/card.tsx'
import { Label } from '@ui/components/ui/label.tsx'
import { Textarea } from '@ui/components/ui/textarea.tsx'
import { useState } from 'react'

export const SourceSettings = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	const [isEditing, setIsEditing] = useState(false)

	const { mutateAsync } = useDispatchStackDeploymentHook(stackDetails.id)
	const handleDeploy = async () => {
		await mutateAsync({} as never)
	}

	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader className='relative'>
					<CardTitle>Source information</CardTitle>
					<CardDescription>
						Basic details about the source of this Stack
					</CardDescription>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='stack-name'>Stack Connection Type</Label>

						<div className='p-2 bg-muted rounded-md'>{stackDetails.name}</div>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='stack-description'>Description</Label>
						{isEditing ? (
							<Textarea
								id='stack-description'
								placeholder='Describe your stack...'
							/>
						) : (
							<div className='p-2 bg-muted rounded-md'>
								Stack description goes here...
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
