import { useDeleteEnvironmentVariableGroupHook } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@cloudcrafter/ui/components/dialog'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

// Import the EnvVarGroup interface from the parent component
import type { EnvVarGroup } from './EnvironmentVariables'

interface DeleteEnvironmentVariableGroupDialogProps {
	stackId: string
	group: EnvVarGroup
	open: boolean
	onOpenChange: (open: boolean) => void
	onSuccess?: () => void
}

export function DeleteEnvironmentVariableGroupDialog({
	stackId,
	group,
	open,
	onOpenChange,
	onSuccess,
}: DeleteEnvironmentVariableGroupDialogProps) {
	const { mutate: deleteGroup, isPending } =
		useDeleteEnvironmentVariableGroupHook({
			mutation: {
				onSuccess: () => {
					toast.success('Group deleted successfully')
					onOpenChange(false)
					onSuccess?.()
				},
				onError: (error) => {
					toast.error('Failed to delete group. Please try again.')
				},
			},
		})

	const handleDelete = () => {
		deleteGroup({
			stackId,
			id: group.id,
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete Environment Variable Group</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this group? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				<div className='mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3'>
					<AlertCircle className='h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5' />
					<div className='text-sm text-amber-800'>
						<p className='font-medium'>Warning</p>
						<p>
							Deleting this group will remove the group association from all
							{group.variableCount > 0 && (
								<strong> {group.variableCount}</strong>
							)}{' '}
							environment variables within it. The variables themselves will
							remain intact but will become ungrouped.
						</p>
					</div>
				</div>
				<DialogFooter className='mt-4'>
					<DialogClose asChild>
						<Button variant='outline' disabled={isPending}>
							Cancel
						</Button>
					</DialogClose>
					<Button
						variant='destructive'
						onClick={handleDelete}
						disabled={isPending}
					>
						{isPending ? 'Deleting...' : 'Delete Group'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
