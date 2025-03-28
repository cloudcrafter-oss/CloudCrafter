'use client'

import type {
	CreateStackEnvironmentVariableCommand,
	StackDetailDto,
} from '@cloudcrafter/api'
import {
	createStackEnvironmentVariableCommandSchema,
	updateStackEnvironmentVariableCommandSchema,
	usePostCreateEnvironmentVariableHook,
	usePutUpdateEnvironmentVariableHook,
} from '@cloudcrafter/api'
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@cloudcrafter/ui/components/sheet'
import { Switch } from '@cloudcrafter/ui/components/switch'
import { Textarea } from '@cloudcrafter/ui/components/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, PlusCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

// Define types
export type EnvVarGroup = {
	id: string
	name: string
	description?: string | null
	allowInheritance?: boolean
	stackId?: string
	createdAt?: string
	lastModifiedAt?: string
	variableCount?: number
}

export interface EnvVar {
	id: string
	key: string
	value: string
	groupId?: string
	variableType: number
	description?: string
	isSecret: boolean
	isInherited: boolean
	createdAt: string
	modifiedAt: string
}

export enum VariableType {
	BuildTime = 0,
	Runtime = 1,
	Both = 2,
}

// Define custom form type that extends the API type to include optional fields
interface EnvironmentVariableFormData
	extends CreateStackEnvironmentVariableCommand {
	description?: string
	groupId?: string
}

// Define an extended API data type that includes our optional fields
export interface ExtendedEnvironmentVariableCommand
	extends CreateStackEnvironmentVariableCommand {
	description?: string
	groupId?: string
}

// Extend the API schema with additional validation rules
const extendedCreateVariableSchema =
	createStackEnvironmentVariableCommandSchema.extend({
		key: createStackEnvironmentVariableCommandSchema.shape.key
			.min(1, 'Key is required')
			.regex(
				/^[A-Za-z0-9_]+$/,
				'Key can only include letters, numbers, and underscores',
			),
		description: z.string().optional(),
	})

// Extend the update schema with our additional fields
const extendedUpdateVariableSchema =
	updateStackEnvironmentVariableCommandSchema.extend({
		key: updateStackEnvironmentVariableCommandSchema.shape.key
			.min(1, 'Key is required')
			.regex(
				/^[A-Za-z0-9_]+$/,
				'Key can only include letters, numbers, and underscores',
			),
		description: z.string().optional(),
	})

interface EnvironmentVariableSheetProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	editingVariable?: EnvVar | null
	groups?: EnvVarGroup[]
	stackDetails: StackDetailDto
	variables: EnvVar[]
	onSuccess?: () => void
}

export function EnvironmentVariableSheet({
	open,
	onOpenChange,
	editingVariable,
	groups = [],
	stackDetails,
	variables,
	onSuccess,
}: EnvironmentVariableSheetProps) {
	const isEditMode = !!editingVariable

	// Use appropriate schema based on edit mode
	const formSchema = isEditMode
		? extendedUpdateVariableSchema
		: extendedCreateVariableSchema
	type FormData = z.infer<typeof formSchema>

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			key: editingVariable?.key || '',
			value: editingVariable?.value || '',
			isSecret: editingVariable?.isSecret || false,
			type: editingVariable?.variableType || VariableType.Both,
			description: editingVariable?.description || '',
			groupId: editingVariable?.groupId || null,
		},
	})

	// Reset form when the editing variable changes
	useEffect(() => {
		if (editingVariable) {
			form.reset({
				key: editingVariable.key,
				value: editingVariable.value,
				isSecret: editingVariable.isSecret,
				type: editingVariable.variableType,
				description: editingVariable.description || '',
				groupId: editingVariable.groupId || null,
			})
		} else if (!open) {
			form.reset({
				key: '',
				value: '',
				isSecret: false,
				type: VariableType.Both,
				description: '',
				groupId: null,
			})
		}
	}, [editingVariable, form, open])

	// Creating variables - mutation hook
	const { mutate: createVariable, isPending: isCreating } =
		usePostCreateEnvironmentVariableHook({
			mutation: {
				onSuccess: () => {
					toast.success('Environment variable created successfully')
					onOpenChange(false)
					form.reset()
					onSuccess?.()
				},
				onError: (error) => {
					toast.error('Failed to create environment variable')
					console.error('Error creating variable:', error)
				},
			},
		})

	// Updating variables - mutation hook
	const { mutate: updateVariable, isPending: isUpdating } =
		usePutUpdateEnvironmentVariableHook({
			mutation: {
				onSuccess: () => {
					toast.success('Environment variable updated successfully')
					onOpenChange(false)
					form.reset()
					onSuccess?.()
				},
				onError: (error) => {
					toast.error('Failed to update environment variable')
					console.error('Error updating variable:', error)
				},
			},
		})

	// Combined loading state
	const isLoading = isCreating || isUpdating

	// Handle form submission based on mode
	const onSubmit = (data: FormData) => {
		// Validate key for duplicates
		if (!isEditMode && variables.some((v) => v.key === data.key)) {
			form.setError('key', {
				message: 'An environment variable with this key already exists',
			})
			return
		}

		if (isEditMode && editingVariable) {
			// Update existing variable
			updateVariable({
				stackId: stackDetails.id,
				id: editingVariable.id,
				data,
			})
		} else {
			// Create new variable
			createVariable({
				stackId: stackDetails.id,
				data,
			})
		}
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='sm:max-w-md overflow-hidden'>
				<div className='px-4 py-4 pb-8 overflow-y-auto h-full max-h-[calc(100vh-4rem)]'>
					<SheetHeader className='mb-5'>
						<SheetTitle>
							{isEditMode
								? 'Edit Environment Variable'
								: 'Add Environment Variable'}
						</SheetTitle>
						<SheetDescription>
							{isEditMode
								? 'Update your environment variable details here.'
								: 'Add a new environment variable to this stack.'}
						</SheetDescription>
					</SheetHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='flex flex-col gap-4'
						>
							<FormField
								control={form.control}
								name='key'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Key *</FormLabel>
										<FormControl>
											<Input
												{...field}
												data-testid='environment-variable-key'
												placeholder='VARIABLE_NAME'
												className='uppercase font-mono'
												onChange={(e) =>
													field.onChange(e.target.value.toUpperCase())
												}
												disabled={isEditMode && editingVariable?.isInherited}
											/>
										</FormControl>
										<p className='text-xs text-muted-foreground'>
											Must start with an uppercase letter and contain only
											uppercase letters, numbers, and underscores. Max 100
											characters.
										</p>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='value'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Value</FormLabel>
										<FormControl>
											<div className='relative'>
												<Textarea
													{...field}
													data-testid='environment-variable-value'
													placeholder='Variable value'
													className='font-mono pr-8'
													rows={3}
													disabled={isEditMode && editingVariable?.isInherited}
												/>
												{form.watch('isSecret') && (
													<div className='absolute top-0 right-0 p-2'>
														<Lock className='h-4 w-4 text-muted-foreground' />
													</div>
												)}
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='type'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Variable Type</FormLabel>
										<Select
											value={field.value.toString()}
											onValueChange={(value) =>
												field.onChange(Number.parseInt(value, 10))
											}
											disabled={isEditMode && editingVariable?.isInherited}
										>
											<FormControl>
												<SelectTrigger data-testid='environment-variable-type-select'>
													<SelectValue placeholder='Select variable type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem
													data-testid='environment-variable-type-build-time'
													value='0'
												>
													Build Time
												</SelectItem>
												<SelectItem
													data-testid='environment-variable-type-runtime'
													value='1'
												>
													Runtime
												</SelectItem>
												<SelectItem
													data-testid='environment-variable-type-both'
													value='2'
												>
													Both
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='isSecret'
								render={({ field }) => (
									<FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
										<div className='space-y-0.5'>
											<FormLabel className='text-base'>Secret Value</FormLabel>
											<p className='text-sm text-muted-foreground'>
												Mask this value in logs and API responses
											</p>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isEditMode && editingVariable?.isInherited}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='description'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												data-testid='environment-variable-description'
												placeholder='Variable description'
												className='font-mono'
												rows={3}
												disabled={isEditMode && editingVariable?.isInherited}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='groupId'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Group</FormLabel>
										<FormControl>
											<Select
												value={field.value || 'none'}
												onValueChange={(value) =>
													field.onChange(value === 'none' ? '' : value)
												}
												disabled={isEditMode && editingVariable?.isInherited}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Select group' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value='none'>No Group</SelectItem>
													{groups?.map((group: EnvVarGroup) => (
														<SelectItem key={group.id} value={group.id}>
															{group.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<SheetFooter className='pt-4'>
								<Button
									data-testid='environment-variable-submit'
									type='submit'
									disabled={isLoading}
									className='ml-auto'
								>
									{isLoading
										? isEditMode
											? 'Updating...'
											: 'Adding...'
										: isEditMode
											? 'Update Variable'
											: 'Add Variable'}
								</Button>
							</SheetFooter>
						</form>
					</Form>
				</div>
			</SheetContent>
		</Sheet>
	)
}

export function EnvironmentVariableSheetTrigger({
	onClick,
}: {
	onClick: () => void
}) {
	return (
		<Button
			variant='outline'
			className='h-8 w-full justify-start gap-2'
			onClick={onClick}
		>
			<PlusCircle className='h-4 w-4' />
			Add Variable
		</Button>
	)
}
