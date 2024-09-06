import type { StackDetailDto } from '@/src/core/__generated__'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@ui/components/ui/card.tsx'
import { Label } from '@ui/components/ui/label.tsx'

export const SourceSettings = ({
	stackDetails,
}: { stackDetails: StackDetailDto }) => {
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
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
