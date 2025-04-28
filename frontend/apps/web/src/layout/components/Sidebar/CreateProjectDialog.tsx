'use client'

import {
	createProjectCommandSchema,
	useCreateProjectHook,
} from '@cloudcrafter/api'
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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { mutate } from 'swr'
import type { z } from 'zod'

type FormData = z.infer<typeof createProjectCommandSchema>

interface CreateProjectDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	teamId: string
	teamName: string
}

export function CreateProjectDialog({
	open,
	onOpenChange,
	teamId,
	teamName,
}: CreateProjectDialogProps) {
	const mutation = useCreateProjectHook({
		mutation: {
			onSuccess: () => {
				onOpenChange(false)
				toast.success('Project created successfully')
				mutate('userTeams')
			},
		},
	})

	const form = useForm<FormData>({
		resolver: zodResolver(createProjectCommandSchema),
		defaultValues: {
			name: '',
			teamId,
		},
	})

	useEffect(() => {
		form.setValue('teamId', teamId)
	}, [teamId, form])

	const onSubmit = (data: FormData) => {
		mutation.mutate({ data })
		form.reset()
	}

	const formErrors = form.formState.errors

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create New Project in {teamName}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Project Name</FormLabel>
									<FormControl>
										<Input placeholder='Enter project name' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{Object.keys(formErrors).length > 0 && (
							<div className='mt-2 space-y-1'>
								{Object.entries(formErrors).map(([key, error]) => (
									<p key={key} className='text-sm text-destructive'>
										{key}: {error.message}
									</p>
								))}
							</div>
						)}
						<div className='flex justify-end gap-2'>
							<Button
								type='button'
								variant='outline'
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type='submit' disabled={mutation.isPending}>
								{mutation.isPending ? 'Creating...' : 'Create Project'}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
