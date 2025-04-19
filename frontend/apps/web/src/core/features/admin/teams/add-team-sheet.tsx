'use client'

import {
	createTeamCommandSchema,
	useCreateTeamHook,
	useRenameTeamHook,
} from '@cloudcrafter/api'
import type { SimpleTeamDto } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import { Input } from '@cloudcrafter/ui/components/input'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@cloudcrafter/ui/components/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

interface AddTeamSheetProps {
	open: boolean
	setOpen: (open: boolean) => void
	onSuccess?: () => void
	team?: SimpleTeamDto | null
}

export function AddTeamSheet({
	open,
	setOpen,
	onSuccess,
	team,
}: AddTeamSheetProps) {
	const isEditing = !!team

	const createMutation = useCreateTeamHook({
		mutation: {
			onSuccess: () => {
				toast.success('Team created successfully')
				setOpen(false)
				onSuccess?.()
			},
		},
	})

	const renameMutation = useRenameTeamHook({
		mutation: {
			onSuccess: () => {
				toast.success('Team updated successfully')
				setOpen(false)
				onSuccess?.()
			},
		},
	})

	const onSubmit = async (values: z.infer<typeof createTeamCommandSchema>) => {
		if (isEditing) {
			renameMutation.mutate({
				teamId: team.id,
				data: {
					name: values.name,
				},
			})
		} else {
			createMutation.mutate({
				data: values,
			})
		}
	}

	const form = useForm<z.infer<typeof createTeamCommandSchema>>({
		resolver: zodResolver(createTeamCommandSchema),
		defaultValues: {
			name: team?.name ?? '',
		},
	})

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent className='w-[400px] sm:w-[540px]'>
				<SheetHeader className='space-y-2'>
					<SheetTitle className='text-xl'>
						{isEditing ? 'Edit Team' : 'Add New Team'}
					</SheetTitle>
					<SheetDescription>
						{isEditing
							? "Update the team name. Click save when you're done."
							: "Create a new team by providing a name. Click save when you're done."}
					</SheetDescription>
				</SheetHeader>
				<Form {...form}>
					<form
						className='flex flex-col gap-4 p-4'
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm font-medium'>
										Team Name
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											value={field.value ?? ''}
											placeholder='Enter team name'
											className='w-full'
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SheetFooter>
							<Button type='submit' className='w-full sm:w-auto'>
								{isEditing ? 'Update Team' : 'Save Team'}
							</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
