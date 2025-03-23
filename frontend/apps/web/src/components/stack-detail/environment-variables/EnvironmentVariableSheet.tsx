'use client'

import type { StackDetailDto } from '@cloudcrafter/api'
import { Button } from '@cloudcrafter/ui/components/button'
import { Input } from '@cloudcrafter/ui/components/input'
import { Label } from '@cloudcrafter/ui/components/label'
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
	SheetTrigger,
} from '@cloudcrafter/ui/components/sheet'
import { Switch } from '@cloudcrafter/ui/components/switch'
import { Textarea } from '@cloudcrafter/ui/components/textarea'
import { Lock, PlusCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

// Define types
interface EnvVarGroup {
	id: string
	name: string
	description?: string
}

export interface EnvVar {
	id: string
	key: string
	value: string
	groupId?: string
	variableType: VariableType
	description?: string
	isSecret: boolean
	isInherited: boolean
	createdAt: string
	modifiedAt: string
}

export enum VariableType {
	BuildTime = 'BuildTime',
	Runtime = 'Runtime',
	Both = 'Both',
}

interface EnvironmentVariableSheetProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	editingVariable: EnvVar | null
	groups: EnvVarGroup[]
	onSave: (variable: EnvVar) => void
	stackDetails: StackDetailDto
}

export function EnvironmentVariableSheet({
	open,
	onOpenChange,
	editingVariable,
	groups,
	onSave,
	stackDetails,
}: EnvironmentVariableSheetProps) {
	// Create a new variable state that gets reset when editingVariable changes
	const [variable, setVariable] = useState<Partial<EnvVar>>(
		editingVariable || {
			key: '',
			value: '',
			groupId: '',
			variableType: VariableType.Both,
			isSecret: false,
			description: '',
		},
	)

	// Reset form when editingVariable changes
	useEffect(() => {
		if (editingVariable) {
			setVariable(editingVariable)
		} else {
			setVariable({
				key: '',
				value: '',
				groupId: '',
				variableType: VariableType.Both,
				isSecret: false,
				description: '',
			})
		}
	}, [editingVariable])

	const isEditing = !!editingVariable

	// Handle form submission
	const handleSave = () => {
		// Form validation
		if (!variable.key) {
			toast.error('Key is required')
			return
		}

		// Validate key format (uppercase letters, numbers, underscores, starts with letter)
		const keyRegex = /^[A-Z][A-Z0-9_]*$/
		if (!keyRegex.test(variable.key)) {
			toast.error(
				'Key must start with an uppercase letter and contain only uppercase letters, numbers, and underscores',
			)
			return
		}

		// Validate key and value length
		if (variable.key.length > 100) {
			toast.error('Key must be 100 characters or less')
			return
		}

		if (variable.value && variable.value.length > 2000) {
			toast.error('Value must be 2000 characters or less')
			return
		}

		// Create complete variable object
		const completeVariable: EnvVar = {
			id: editingVariable?.id || crypto.randomUUID(),
			key: variable.key || '',
			value: variable.value || '',
			groupId: variable.groupId || '',
			variableType: variable.variableType || VariableType.Both,
			description: variable.description || '',
			isSecret: variable.isSecret || false,
			isInherited: editingVariable?.isInherited || false,
			createdAt: editingVariable?.createdAt || new Date().toISOString(),
			modifiedAt: new Date().toISOString(),
		}

		// Call onSave with the new/updated variable
		onSave(completeVariable)

		// Close the sheet
		onOpenChange(false)
	}

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

				<div className='grid gap-4 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='key'>Key *</Label>
						<Input
							id='key'
							placeholder='VARIABLE_NAME'
							className='uppercase font-mono'
							value={variable?.key || ''}
							onChange={(e) =>
								setVariable({ ...variable, key: e.target.value.toUpperCase() })
							}
							disabled={isEditing && (variable?.isInherited || false)}
						/>
						<p className='text-xs text-muted-foreground'>
							Must start with an uppercase letter and contain only uppercase
							letters, numbers, and underscores. Max 100 characters.
						</p>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='value'>Value</Label>
						<div className='relative'>
							<Textarea
								id='value'
								className='font-mono pr-8'
								placeholder='Variable value'
								rows={3}
								value={variable?.value || ''}
								onChange={(e) =>
									setVariable({ ...variable, value: e.target.value })
								}
								disabled={isEditing && (variable?.isInherited || false)}
							/>
							{variable?.isSecret && (
								<div className='absolute top-0 right-0 p-2'>
									<Lock className='h-4 w-4 text-muted-foreground' />
								</div>
							)}
						</div>
						<p className='text-xs text-muted-foreground'>
							Maximum 2000 characters
						</p>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='group'>Group (Optional)</Label>
						<Select
							value={variable?.groupId || 'none'}
							onValueChange={(value) => {
								const groupId = value === 'none' ? '' : value
								setVariable({ ...variable, groupId })
							}}
							disabled={isEditing && (variable?.isInherited || false)}
						>
							<SelectTrigger id='group'>
								<SelectValue placeholder='Select a group or leave empty' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='none'>No Group</SelectItem>
								{groups.map((group) => (
									<SelectItem key={group.id} value={group.id}>
										{group.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='description'>Description (Optional)</Label>
						<Textarea
							id='description'
							placeholder='Variable description'
							rows={2}
							value={variable?.description || ''}
							onChange={(e) =>
								setVariable({ ...variable, description: e.target.value })
							}
							disabled={isEditing && (variable?.isInherited || false)}
						/>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='type'>Type *</Label>
						<Select
							value={variable?.variableType || VariableType.Both}
							onValueChange={(value: string) => {
								setVariable({
									...variable,
									variableType: value as VariableType,
								})
							}}
							disabled={isEditing && (variable?.isInherited || false)}
						>
							<SelectTrigger id='type'>
								<SelectValue placeholder='Select variable type' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={VariableType.BuildTime}>
									Build Time
								</SelectItem>
								<SelectItem value={VariableType.Runtime}>Runtime</SelectItem>
								<SelectItem value={VariableType.Both}>Both</SelectItem>
							</SelectContent>
						</Select>
						<p className='text-xs text-muted-foreground'>
							Determines when this variable will be available
						</p>
					</div>

					<div className='flex items-center space-x-2'>
						<Switch
							id='isSecret'
							checked={variable?.isSecret || false}
							onCheckedChange={(checked) =>
								setVariable({ ...variable, isSecret: checked })
							}
							disabled={isEditing && (variable?.isInherited || false)}
						/>
						<Label htmlFor='isSecret'>Secret Value</Label>
						<p className='text-xs text-muted-foreground ml-2'>
							Secret values are masked in the UI and API responses
						</p>
					</div>
				</div>

				<SheetFooter>
					<Button variant='outline' onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						disabled={isEditing && (variable?.isInherited || false)}
					>
						{isEditing ? 'Update' : 'Create'} Variable
					</Button>
				</SheetFooter>
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
		<SheetTrigger asChild>
			<Button onClick={onClick}>
				<PlusCircle className='h-4 w-4 mr-2' />
				Add Variable
			</Button>
		</SheetTrigger>
	)
}
