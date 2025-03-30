'use client'
import { stackSourceDtoTypeEnum } from '@cloudcrafter/api'
import type { StackDetailDto } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import { PencilIcon } from 'lucide-react'
import { useState } from 'react'
import { GithubAppForm } from './github-app/form'
import { PublicGitForm } from './public-git/form'
export const SourceSettings = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
	const [isEditing, setIsEditing] = useState(false)

	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader className='relative'>
					<CardTitle>Source information</CardTitle>
					<CardDescription>
						Basic details about the source of this Stack
					</CardDescription>
					<div className='absolute top-4 right-4 flex items-center space-x-2'>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setIsEditing(!isEditing)}
						>
							<PencilIcon className='h-4 w-4' />
						</Button>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					{stackDetails.source?.type === stackSourceDtoTypeEnum.Git && (
						<PublicGitForm
							stackDetails={stackDetails}
							setIsEditing={setIsEditing}
							isEditing={isEditing}
						/>
					)}

					{stackDetails.source?.type === stackSourceDtoTypeEnum.GithubApp && (
						<GithubAppForm
							stackDetails={stackDetails}
							setIsEditing={setIsEditing}
							isEditing={isEditing}
						/>
					)}
					<pre>{JSON.stringify(stackDetails.source, null, 2)}</pre>
				</CardContent>
			</Card>
		</div>
	)
}
