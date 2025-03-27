import {
	deleteProjectAction,
	fetchProjectDetail,
	updateProjectAction,
} from '@/src/app/_actions/project'
import { updateProjectArgsSchema } from '@cloudcrafter/api'
import type { ProjectDto } from '@cloudcrafter/api'
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
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@cloudcrafter/ui/components/popover'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@cloudcrafter/ui/components/sheet'
import { Spinner } from '@cloudcrafter/ui/components/spinner'
import { zodResolver } from '@hookform/resolvers/zod'
import { SettingsIcon } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

type FormValues = z.infer<typeof updateProjectArgsSchema>

export const ProjectListItem = ({
	project,
	onCloseEditSheet,
}: { project: ProjectDto; onCloseEditSheet: () => void }) => {
	const [showEditSheet, setShowEditSheet] = useState(false)
	const [showDeletePopover, setShowDeletePopover] = useState(false)

	const {
		executeAsync: fetchProjectExecuteAsync,
		isExecuting: projectIsFetching,
		result: projectResult,
	} = useAction(fetchProjectDetail)

	const { executeAsync: updateProjectExecuteAsync, isExecuting } =
		useAction(updateProjectAction)
	const {
		executeAsync: deleteProjectExecuteAsync,
		isExecuting: deleteProjectIsExecuting,
	} = useAction(deleteProjectAction)

	const form = useForm<FormValues>({
		resolver: zodResolver(updateProjectArgsSchema),
		defaultValues: projectResult.data,
	})

	const openProject = async (projectId: string) => {
		setShowEditSheet(true)
		const asyncResult = await fetchProjectExecuteAsync({ id: projectId })

		if (asyncResult?.data) {
			form.reset(asyncResult.data)
		}
	}

	const onSubmit = async (data: FormValues) => {
		await updateProjectExecuteAsync({ id: project.id, project: data })
		toast.success('Project updated successfully')
	}

	const handleDelete = async () => {
		await deleteProjectExecuteAsync({ id: project.id })
		toast.success('Project deleted successfully')

		onCloseEditSheet()
	}

	const saveButtonDisabled =
		projectIsFetching || isExecuting || !form.formState.isDirty

	const deleteButtonDisabled =
		projectIsFetching || isExecuting || deleteProjectIsExecuting

	return (
		<div className='border border-input rounded-lg'>
			<div className='flex justify-between items-center p-4 bg-card rounded-t-lg cursor-pointer'>
				<div className='flex items-center space-x-2'>
					<span className='font-semibold'>{project.name}</span>
					<span className='w-2.5 h-2.5 bg-green-500 rounded-full' />
				</div>
				<div className='flex space-x-2'>
					<Sheet onOpenChange={setShowEditSheet} open={showEditSheet}>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Edit project</SheetTitle>
								<SheetDescription>
									Make changes to your project here. Click save when you're
									done.
								</SheetDescription>
							</SheetHeader>
							<div className='grid gap-4 py-4'>
								{projectIsFetching && (
									<div className={'flex flex-1 justify-center items-center'}>
										<Spinner />
									</div>
								)}

								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className='space-y-4'
									>
										<FormField
											disabled={projectIsFetching || isExecuting}
											key={'name'}
											control={form.control}
											name={'name' as keyof FormValues}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Name</FormLabel>
													<FormControl>
														<Input {...field} value={field.value ?? ''} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											disabled={projectIsFetching || isExecuting}
											key={'description'}
											control={form.control}
											name={'description' as keyof FormValues}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description</FormLabel>
													<FormControl>
														<Input {...field} value={field.value ?? ''} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</form>
								</Form>
							</div>
							<SheetFooter>
								<Popover
									open={showDeletePopover}
									onOpenChange={setShowDeletePopover}
								>
									<PopoverTrigger asChild>
										<Button
											variant={'destructive'}
											data-testid='btn-delete-project'
											disabled={deleteButtonDisabled}
										>
											Delete
										</Button>
									</PopoverTrigger>
									<PopoverContent>
										<div className='p-4'>
											<p>Are you sure you want to delete this project?</p>
											<div className='flex justify-end space-x-2 mt-4'>
												<Button
													variant='outline'
													onClick={() => setShowDeletePopover(false)}
												>
													Cancel
												</Button>
												<Button
													variant='destructive'
													data-testid='btn-confirm-delete'
													onClick={handleDelete}
												>
													Confirm
												</Button>
											</div>
										</div>
									</PopoverContent>
								</Popover>
								<SheetClose asChild>
									<Button
										disabled={saveButtonDisabled}
										onClick={form.handleSubmit(onSubmit)}
									>
										Save changes
									</Button>
								</SheetClose>
							</SheetFooter>
						</SheetContent>
					</Sheet>
					<button
						type='button'
						data-testid={`btn-edit-project-${project.id}`}
						onClick={async () => await openProject(project.id)}
						className='p-2 bg-muted rounded-full hover:bg-muted-foreground'
					>
						<SettingsIcon className='w-4 h-4 text-muted-foreground' />
					</button>
				</div>
			</div>
		</div>
	)
}
