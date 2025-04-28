'use client'
import { useInviteUserToTeamHook } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@cloudcrafter/ui/components/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import { Input } from '@cloudcrafter/ui/components/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const addTeamMemberSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
})

type FormData = z.infer<typeof addTeamMemberSchema>

interface AddTeamMemberDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	teamUuid: string
}

export function AddTeamMemberDialog({
	open,
	onOpenChange,
	teamUuid,
}: AddTeamMemberDialogProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(addTeamMemberSchema),
		defaultValues: {
			email: '',
		},
	})

	const mutation = useInviteUserToTeamHook({
		mutation: {
			onSuccess: () => {
				toast.success('Team member invited successfully')
				onOpenChange(false)
				form.reset()
			},
			onError: () => {
				toast.error('Failed to invite team member')
			},
		},
	})

	const onSubmit = async (data: FormData) => {
		mutation.mutate({
			teamId: teamUuid,
			data: {
				email: data.email,
			},
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Team Member</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email Address</FormLabel>
									<FormControl>
										<Input
											placeholder='Enter email address'
											type='email'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex justify-end gap-2'>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={mutation.isPending}>
								{mutation.isPending ? 'Adding...' : 'Add Member'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
