'use client'

import {
	type StackDetailDto,
	type StackEnvironmentVariableGroupDto,
	useGetEnvironmentVariableGroupsHook,
	useGetEnvironmentVariablesHook,
} from '@cloudcrafter/api'
import { toast } from 'sonner'
import { CreateEnvironmentVariableGroupSheet } from './CreateEnvironmentVariableGroupSheet'
import { DeleteEnvironmentVariableGroupDialog } from './DeleteEnvironmentVariableGroupDialog'
import {
	type EnvVar,
	EnvironmentVariableSheet,
	VariableType,
} from './EnvironmentVariableSheet'
import { UpdateEnvironmentVariableGroupSheet } from './UpdateEnvironmentVariableGroupSheet'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@cloudcrafter/ui/components/accordion'
import { Badge } from '@cloudcrafter/ui/components/badge'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import { Input } from '@cloudcrafter/ui/components/input'
import { Label } from '@cloudcrafter/ui/components/label'
import { ScrollArea } from '@cloudcrafter/ui/components/scroll-area'
import { Switch } from '@cloudcrafter/ui/components/switch'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@cloudcrafter/ui/components/table'
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@cloudcrafter/ui/components/tabs'

import {
	Copy,
	Download,
	Edit,
	Eye,
	EyeOff,
	FileText,
	Group,
	Lock,
	PlusCircle,
	RefreshCw,
	Trash2,
} from 'lucide-react'

import { useEffect, useState } from 'react'

// Extended version of StackEnvironmentVariableGroupDto to include properties
// we need but might not be in the generated type
export interface EnvVarGroup {
	id: string
	name: string
	description?: string | null
	allowInheritance: boolean
	stackId: string
	createdAt: string
	lastModifiedAt?: string
	variableCount: number
}

interface StackEnvironmentVariableDto {
	id: string
	stackId: string
	groupId?: string
	key: string
	value: string
	isSecret: boolean
	type: number // Enum in backend: BuildTime = 0, Runtime = 1, Both = 2
	createdAt: string
	lastModifiedAt?: string
	groupName?: string
}

export const EnvironmentVariables: React.FC<{
	stackDetails: StackDetailDto
}> = ({ stackDetails }) => {
	// Environment variables state
	const [groups, setGroups] = useState<EnvVarGroup[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('all')
	const [showSecrets, setShowSecrets] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [groupView, setGroupView] = useState(true)

	// Sheet state for adding/editing variables
	const [sheetOpen, setSheetOpen] = useState(false)
	const [editingVariable, setEditingVariable] = useState<EnvVar | null>(null)

	// State for group management
	const [editingGroup, setEditingGroup] = useState<EnvVarGroup | null>(null)
	const [editGroupSheetOpen, setEditGroupSheetOpen] = useState(false)
	const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false)
	const [groupToDelete, setGroupToDelete] = useState<EnvVarGroup | null>(null)

	const environmentVarsHook = useGetEnvironmentVariablesHook(stackDetails.id, {
		includeSecrets: showSecrets,
	})
	const environmentGroupsHook = useGetEnvironmentVariableGroupsHook(
		stackDetails.id,
	)

	// Process data from the hooks
	useEffect(() => {
		setIsLoading(
			environmentVarsHook.isLoading || environmentGroupsHook.isLoading,
		)

		// Process groups from the API
		if (environmentGroupsHook.data) {
			const apiGroups: EnvVarGroup[] = (
				environmentGroupsHook.data as StackEnvironmentVariableGroupDto[]
			).map((apiGroup) => ({
				id: apiGroup.id,
				name: apiGroup.name,
				description: apiGroup.description,
				// Add default values for properties that might not be in the API response
				allowInheritance: false, // Default value, replace with actual property if available
				stackId: stackDetails.id,
				createdAt: new Date().toISOString(),
				lastModifiedAt: undefined,
				variableCount: 0, // Default value, replace with actual property if available
			}))
			setGroups(apiGroups)
		}
	}, [
		environmentVarsHook.isLoading,
		environmentGroupsHook.data,
		environmentGroupsHook.isLoading,
		stackDetails.id,
	])

	// Helper function to map API type to our variable type enum
	const mapTypeToVariableType = (type: number): VariableType => {
		switch (type) {
			case 0:
				return VariableType.BuildTime
			case 1:
				return VariableType.Runtime
			case 2:
				return VariableType.Both
			default:
				return VariableType.Both
		}
	}

	// Helper function to convert API variable to EnvVar format
	const mapApiVarToEnvVar = (apiVar: StackEnvironmentVariableDto): EnvVar => ({
		id: apiVar.id,
		key: apiVar.key,
		value: apiVar.value,
		isSecret: apiVar.isSecret,
		variableType: mapTypeToVariableType(apiVar.type),
		groupId: apiVar.groupId || '',
		description: apiVar.groupName || '',
		isInherited: false, // Add default value since API doesn't have this property
		createdAt: apiVar.createdAt,
		modifiedAt: apiVar.lastModifiedAt || apiVar.createdAt,
	})

	// Refresh data function
	const refreshData = () => {
		environmentVarsHook.refetch()
		environmentGroupsHook.refetch()
	}

	// Add or update a variable
	const handleAddOrUpdateVariable = (variable: EnvVar) => {
		refreshData()
	}

	// Delete a variable
	const handleDeleteVariable = (id: string) => {
		refreshData()
	}

	// Toggle secret status of a variable
	const handleToggleSecret = (id: string) => {
		if (!environmentVarsHook.data) return

		const variable = (
			environmentVarsHook.data as StackEnvironmentVariableDto[]
		).find((v) => v.id === id)

		if (!variable) return

		const updatedVariable: EnvVar = {
			...mapApiVarToEnvVar(variable),
			isSecret: !variable.isSecret,
		}

		// Logic to update the variable secret status...
		handleAddOrUpdateVariable(updatedVariable)
	}

	// Copy variable value to clipboard
	const handleCopyVariable = (value: string) => {
		navigator.clipboard.writeText(value)
		toast.success('Value copied to clipboard')
	}

	// Export variables as JSON
	const handleExportVariables = () => {
		if (!environmentVarsHook.data) return

		const variables = (
			environmentVarsHook.data as StackEnvironmentVariableDto[]
		).map(mapApiVarToEnvVar)

		const exportData = {
			variables: variables.map((v) => ({
				key: v.key,
				value: v.value,
				isSecret: v.isSecret,
				type: v.variableType,
				group: v.groupId
					? groups.find((g) => g.id === v.groupId)?.name ?? undefined
					: undefined,
			})),
		}

		const dataStr = JSON.stringify(exportData, null, 2)
		const blob = new Blob([dataStr], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${stackDetails.name}-env-vars.json`
		a.click()
		URL.revokeObjectURL(url)
	}

	// Filter variables based on search term and active tab
	const getFilteredVariables = () => {
		if (!environmentVarsHook.data) return []

		return (environmentVarsHook.data as StackEnvironmentVariableDto[])
			.map(mapApiVarToEnvVar)
			.filter((variable) => {
				// Filter by search term
				const matchesSearch =
					searchTerm === '' ||
					variable.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
					variable.description?.toLowerCase().includes(searchTerm.toLowerCase())

				// Filter by tab
				const matchesTab =
					activeTab === 'all' ||
					(activeTab === 'build' &&
						variable.variableType === VariableType.BuildTime) ||
					(activeTab === 'runtime' &&
						variable.variableType === VariableType.Runtime) ||
					(activeTab === 'both' &&
						variable.variableType === VariableType.Both) ||
					(activeTab === 'secrets' && variable.isSecret)

				return matchesSearch && matchesTab
			})
	}

	// Group variables by their group
	const getGroupedVariables = () => {
		const filtered = getFilteredVariables()
		const grouped: Record<string, EnvVar[]> = {}

		// First, initialize all groups with empty arrays
		groups.forEach((group) => {
			grouped[group.name] = []
		})

		// Add variables without a group to 'Ungrouped'
		const ungrouped = filtered.filter((v) => !v.groupId)
		if (ungrouped.length > 0) {
			grouped.Ungrouped = ungrouped
		}

		// Add variables to their respective groups
		filtered
			.filter((v) => v.groupId)
			.forEach((v) => {
				const group = groups.find((g) => g.id === v.groupId)
				if (group) {
					grouped[group.name].push(v)
				}
			})

		return grouped
	}

	// Render the value of a variable, masking secrets if necessary
	const renderVariableValue = (variable: EnvVar) => {
		if (variable.isSecret && !showSecrets) {
			return '••••••••'
		}
		return variable.value
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<div>
						<CardTitle>Environment Variables</CardTitle>
						<CardDescription>
							Manage environment variables for your stack. Variables can be used
							at build time, runtime, or both.
						</CardDescription>
					</div>
					<div className='flex flex-wrap gap-2'>
						<Button
							variant='outline'
							onClick={handleExportVariables}
							title='Export Variables'
						>
							<Download className='h-4 w-4 mr-2' />
							Export
						</Button>
						<CreateEnvironmentVariableGroupSheet
							stackId={stackDetails.id}
							onSuccess={() => environmentGroupsHook.refetch()}
						/>
						<Button
							data-testid='add-variable'
							onClick={() => setSheetOpen(true)}
						>
							<PlusCircle className='h-4 w-4 mr-2' />
							Add Variable
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
						<Input
							placeholder='Search variables...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full sm:w-80'
						/>
						<div className='flex flex-wrap gap-2'>
							<div className='flex items-center space-x-2'>
								<Switch
									id='show-secrets'
									checked={showSecrets}
									onCheckedChange={setShowSecrets}
								/>
								<Label htmlFor='show-secrets'>Show secrets</Label>
							</div>

							{/* Search input */}
							<div className='flex-1'>
								<Input
									placeholder='Search variables...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-full'
								/>
							</div>

							{/* Group view toggle */}
							<div className='flex items-center space-x-2'>
								<Switch
									id='group-view'
									checked={groupView}
									onCheckedChange={setGroupView}
								/>
								<Label htmlFor='group-view'>Group view</Label>
							</div>
						</div>
					</div>

					<Tabs
						defaultValue='all'
						value={activeTab}
						onValueChange={setActiveTab}
					>
						<TabsList>
							<TabsTrigger value='all'>All Variables</TabsTrigger>
							<TabsTrigger value='build'>Build Time</TabsTrigger>
							<TabsTrigger value='runtime'>Runtime</TabsTrigger>
							<TabsTrigger value='both'>Both</TabsTrigger>
							<TabsTrigger value='secrets'>Secrets</TabsTrigger>
						</TabsList>

						<TabsContent value={activeTab} className='mt-4'>
							{isLoading ? (
								<div className='flex justify-center items-center h-48'>
									<RefreshCw className='h-8 w-8 animate-spin text-primary' />
								</div>
							) : getFilteredVariables().length === 0 ? (
								<div className='flex flex-col justify-center items-center h-48 text-muted-foreground'>
									<FileText className='h-12 w-12 mb-2' />
									<p>No environment variables found</p>
									<Button
										variant='outline'
										className='mt-4'
										onClick={() => setSheetOpen(true)}
									>
										<PlusCircle className='h-4 w-4 mr-2' />
										Add your first variable
									</Button>
								</div>
							) : groupView ? (
								<ScrollArea className='h-[50vh]'>
									<Accordion
										type='multiple'
										defaultValue={groups.map((g) => g.name)}
									>
										{Object.entries(getGroupedVariables()).map(
											([groupName, variables]) => (
												<AccordionItem value={groupName} key={groupName}>
													<AccordionTrigger>
														<div className='flex items-center'>
															<Group className='h-4 w-4 mr-2' />
															<span>{groupName}</span>
															<Badge variant='outline' className='ml-2'>
																{variables.length}
															</Badge>
															{groupName !== 'Ungrouped' &&
																groups.find((g) => g.name === groupName)
																	?.allowInheritance && (
																	<Badge variant='secondary' className='ml-2'>
																		Inheritable
																	</Badge>
																)}
															{groupName !== 'Ungrouped' && (
																<div className='flex items-center ml-4 gap-2'>
																	<Button
																		variant='ghost'
																		size='sm'
																		className='h-8 w-8 p-0'
																		onClick={(e) => {
																			e.preventDefault()
																			// Find the group in our processed groups array
																			const groupData = groups.find(
																				(g) => g.name === groupName,
																			)
																			if (groupData) {
																				setEditingGroup(groupData)
																				setEditGroupSheetOpen(true)
																			}
																		}}
																		title='Edit group'
																	>
																		<Edit className='h-4 w-4' />
																	</Button>
																	<Button
																		variant='ghost'
																		size='sm'
																		className='h-8 w-8 p-0 text-destructive'
																		onClick={(e) => {
																			e.preventDefault()
																			// Find the group in our processed groups array
																			const groupData = groups.find(
																				(g) => g.name === groupName,
																			)
																			if (groupData) {
																				setGroupToDelete(groupData)
																				setDeleteGroupDialogOpen(true)
																			}
																		}}
																		title='Delete group'
																	>
																		<Trash2 className='h-4 w-4' />
																	</Button>
																</div>
															)}
														</div>
													</AccordionTrigger>
													<AccordionContent>
														{groupName !== 'Ungrouped' &&
															groups.find((g) => g.name === groupName)
																?.description && (
																<div className='text-sm text-muted-foreground mb-4'>
																	{
																		groups.find((g) => g.name === groupName)
																			?.description
																	}
																</div>
															)}
														<VariablesTable
															variables={variables}
															renderValue={renderVariableValue}
															onEdit={(variable) => {
																setEditingVariable(variable)
																setSheetOpen(true)
															}}
															onDelete={handleDeleteVariable}
															onToggleSecret={handleToggleSecret}
															onCopy={handleCopyVariable}
														/>
													</AccordionContent>
												</AccordionItem>
											),
										)}
									</Accordion>
								</ScrollArea>
							) : (
								<ScrollArea className='h-[50vh]'>
									<VariablesTable
										variables={getFilteredVariables()}
										renderValue={renderVariableValue}
										onEdit={(variable) => {
											setEditingVariable(variable)
											setSheetOpen(true)
										}}
										onDelete={handleDeleteVariable}
										onToggleSecret={handleToggleSecret}
										onCopy={handleCopyVariable}
									/>
								</ScrollArea>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</CardContent>

			{/* Group management modals */}
			{editingGroup && (
				<UpdateEnvironmentVariableGroupSheet
					stackId={stackDetails.id}
					group={editingGroup}
					open={editGroupSheetOpen}
					onOpenChange={setEditGroupSheetOpen}
					onSuccess={refreshData}
				/>
			)}

			{groupToDelete && (
				<DeleteEnvironmentVariableGroupDialog
					stackId={stackDetails.id}
					group={groupToDelete}
					open={deleteGroupDialogOpen}
					onOpenChange={setDeleteGroupDialogOpen}
					onSuccess={refreshData}
				/>
			)}

			{/* Environment variable sheet for adding/editing variables */}
			<EnvironmentVariableSheet
				open={sheetOpen || !!editingVariable}
				onOpenChange={(open) => {
					if (!open) {
						setSheetOpen(false)
						setEditingVariable(null)
					} else {
						setSheetOpen(true)
					}
				}}
				editingVariable={editingVariable}
				groups={groups}
				stackDetails={stackDetails}
				variables={(environmentVarsHook.data ?? []).map((variable) => ({
					id: variable.id,
					key: variable.key,
					value: variable.value,
					groupId: variable.groupId || undefined, // Convert null to undefined
					variableType: variable.type,
					description: undefined, // API doesn't seem to provide this
					isSecret: variable.isSecret,
					isInherited: false, // Assuming this isn't provided by the API
					createdAt: variable.createdAt,
					modifiedAt: variable.lastModifiedAt || variable.createdAt,
				}))}
				onSuccess={refreshData}
			/>
		</Card>
	)
}

// Helper component for the table of variables
interface VariablesTableProps {
	variables: EnvVar[]
	renderValue: (variable: EnvVar) => string
	onEdit: (variable: EnvVar) => void
	onDelete: (id: string) => void
	onToggleSecret: (id: string) => void
	onCopy: (value: string) => void
}

const VariablesTable: React.FC<VariablesTableProps> = ({
	variables,
	renderValue,
	onEdit,
	onDelete,
	onToggleSecret,
	onCopy,
}) => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Key</TableHead>
				<TableHead>Value</TableHead>
				<TableHead>Type</TableHead>
				<TableHead>Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{variables.map((variable) => (
				<TableRow key={variable.id}>
					<TableCell className='font-mono relative'>
						<div className='flex items-center gap-2'>
							{variable.key}
							{variable.isSecret && (
								<div className='absolute top-0 right-0 p-2'>
									<Lock className='h-4 w-4 text-muted-foreground' />
								</div>
							)}
						</div>
						{variable.description && (
							<div className='text-xs text-muted-foreground mt-1'>
								{variable.description}
							</div>
						)}
					</TableCell>
					<TableCell className='font-mono'>
						<div className='flex items-center gap-2'>
							{renderValue(variable)}
							<Button
								variant='ghost'
								size='sm'
								className='h-6 w-6 p-0'
								onClick={() => onCopy(variable.value)}
								title='Copy to clipboard'
							>
								<Copy className='h-3 w-3' />
							</Button>
						</div>
					</TableCell>
					<TableCell>
						{variable.variableType === VariableType.Both ? (
							<Badge>Build & Runtime</Badge>
						) : variable.variableType === VariableType.BuildTime ? (
							<Badge variant='outline'>Build Time</Badge>
						) : (
							<Badge variant='secondary'>Runtime</Badge>
						)}
					</TableCell>
					<TableCell>
						<div className='flex items-center gap-2'>
							<Button
								variant='ghost'
								size='sm'
								className='h-8 w-8 p-0'
								onClick={() => onToggleSecret(variable.id)}
								title={
									variable.isSecret ? 'Unmark as secret' : 'Mark as secret'
								}
							>
								{variable.isSecret ? (
									<EyeOff className='h-4 w-4' />
								) : (
									<Eye className='h-4 w-4' />
								)}
							</Button>
							<Button
								variant='ghost'
								size='sm'
								className='h-8 w-8 p-0'
								onClick={() => onEdit(variable)}
								title='Edit variable'
							>
								<Edit className='h-4 w-4' />
							</Button>
							<Button
								variant='ghost'
								size='sm'
								className='h-8 w-8 p-0 text-destructive'
								onClick={() => onDelete(variable.id)}
								title='Delete variable'
							>
								<Trash2 className='h-4 w-4' />
							</Button>
						</div>
					</TableCell>
				</TableRow>
			))}
		</TableBody>
	</Table>
)
