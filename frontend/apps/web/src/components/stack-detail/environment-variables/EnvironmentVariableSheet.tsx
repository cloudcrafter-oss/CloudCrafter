'use client'

import type {
	CreateStackEnvironmentVariableCommand,
	StackDetailDto,
} from '@cloudcrafter/api'
import {
	createStackEnvironmentVariableCommandSchema,
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

// Define types
export type EnvVarGroup = {
	id: string
	name: string
	description?: string
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
interface ExtendedEnvironmentVariableCommand
	extends CreateStackEnvironmentVariableCommand {
	description?: string
	groupId?: string
}

// Extend the API schema with additional validation rules
const extendedVariableSchema =
	createStackEnvironmentVariableCommandSchema.extend({
		key: createStackEnvironmentVariableCommandSchema.shape.key
			.min(1, 'Key is required')
			.max(100, 'Key must be 100 characters or less'),
		value: createStackEnvironmentVariableCommandSchema.shape.value
			.min(1, 'Value is required')
			.max(2000, 'Value must be 2000 characters or less'),
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
	const form = useForm<EnvironmentVariableFormData>({
		resolver: zodResolver(extendedVariableSchema),
		defaultValues: {
			key: '',
			value: '',
			type: VariableType.Both,
			isSecret: false,
			description: '',
			groupId: '',
		},
	})

	// Create and update environment variables
	const { mutateAsync: createEnvironmentVariable } =
		usePostCreateEnvironmentVariableHook()
	const { mutateAsync: updateEnvironmentVariable } =
		usePutUpdateEnvironmentVariableHook()

	const handleCreateVariable = async (data: EnvironmentVariableFormData) => {
		try {
			const apiData: ExtendedEnvironmentVariableCommand = {
				key: data.key,
				value: data.value,
				type: data.type,
				isSecret: data.isSecret,
			}

			// Add description and groupId if they exist and aren't the 'none' placeholder
			if (data.description) {
				apiData.description = data.description
			}

			if (data.groupId && data.groupId !== 'none') {
				apiData.groupId = data.groupId
			}

			await createEnvironmentVariable({
				stackId: stackDetails.id,
				data: apiData,
			})

			toast.success(`Environment variable ${data.key} created`)
			onSuccess?.()
			onOpenChange(false)
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			toast.error(`Error creating environment variable: ${errorMessage}`)
		}
	}

	const handleUpdateVariable = async (
		data: EnvironmentVariableFormData,
		id: string,
	) => {
		try {
			const apiData: ExtendedEnvironmentVariableCommand = {
				key: data.key,
				value: data.value,
				type: data.type,
				isSecret: data.isSecret,
			}

			// Add description and groupId if they exist and aren't the 'none' placeholder
			if (data.description) {
				apiData.description = data.description
			}

			if (data.groupId && data.groupId !== 'none') {
				apiData.groupId = data.groupId
			}

			await updateEnvironmentVariable({
				stackId: stackDetails.id,
				id,
				data: apiData,
			})

			toast.success(`Environment variable ${data.key} updated`)
			onSuccess?.()
			onOpenChange(false)
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			toast.error(`Error updating environment variable: ${errorMessage}`)
		}
	}

	useEffect(() => {
		if (editingVariable) {
			form.reset({
				key: editingVariable.key,
				value: editingVariable.value,
				type: editingVariable.variableType,
				isSecret: editingVariable.isSecret,
				description: editingVariable.description,
				groupId: editingVariable.groupId || 'none',
			})
		} else {
			form.reset({
				key: '',
				value: '',
				type: VariableType.Both,
				isSecret: false,
				description: '',
				groupId: 'none',
			})
		}
	}, [editingVariable, form])

	const onSubmit = (data: EnvironmentVariableFormData) => {
		const isEditing = !!editingVariable

		if (isEditing && editingVariable) {
			// Update existing variable
			handleUpdateVariable(data, editingVariable.id)
		} else {
			// Create new variable
			handleCreateVariable(data)
		}
	}

	const isEditing = !!editingVariable
	const isLoading = false // Set to loading state when implementing API hooks

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className='sm:max-w-md'>
				<SheetHeader>
					<SheetTitle>
						{isEditing ? 'Edit' : 'Add'} Environment Variable
					</SheetTitle>
					<SheetDescription>
						{isEditing
							? 'Update an existing environment variable for your stack'
							: 'Create a new environment variable for your stack'}
					</SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='grid gap-4 py-4'
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
											placeholder='VARIABLE_NAME'
											className='uppercase font-mono'
											onChange={(e) =>
												field.onChange(e.target.value.toUpperCase())
											}
											disabled={isEditing && editingVariable?.isInherited}
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
												placeholder='Variable value'
												className='font-mono pr-8'
												rows={3}
												disabled={isEditing && editingVariable?.isInherited}
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
										disabled={isEditing && editingVariable?.isInherited}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Select variable type' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='0'>Build Time</SelectItem>
											<SelectItem value='1'>Runtime</SelectItem>
											<SelectItem value='2'>Both</SelectItem>
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
											disabled={isEditing && editingVariable?.isInherited}
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
											placeholder='Variable description'
											className='font-mono'
											rows={3}
											disabled={isEditing && editingVariable?.isInherited}
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
											disabled={isEditing && editingVariable?.isInherited}
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

						<SheetFooter className='mt-4'>
							<Button type='submit' disabled={isLoading}>
								{isLoading
									? 'Saving...'
									: isEditing
										? 'Save Changes'
										: 'Add Variable'}
							</Button>
						</SheetFooter>
					</form>
				</Form>
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
