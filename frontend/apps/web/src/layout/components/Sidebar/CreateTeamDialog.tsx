'use client'

import { createTeamCommandSchema, useCreateTeamHook } from '@cloudcrafter/api'
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
import { mutate } from 'swr'
import type { z } from 'zod'

type FormData = z.infer<typeof createTeamCommandSchema>

interface CreateTeamDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function CreateTeamDialog({
	open,
	onOpenChange,
}: CreateTeamDialogProps) {
	const mutation = useCreateTeamHook({
		mutation: {
			onSuccess: () => {
				onOpenChange(false)
				toast.success('Team created successfully')
				mutate('userTeams')
			},
		},
	})

	const form = useForm<FormData>({
		resolver: zodResolver(createTeamCommandSchema),
		defaultValues: {
			name: '',
		},
	})

	const onSubmit = (data: FormData) => {
		mutation.mutate({ data })
		form.reset()
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Team</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Team Name</FormLabel>
									<FormControl>
										<Input placeholder='Enter team name' {...field} />
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
								{mutation.isPending ? 'Creating...' : 'Create Team'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
