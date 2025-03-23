'use client'

import type { StackDetailDto } from '@cloudcrafter/api'
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@cloudcrafter/ui/components/dialog'
import { Input } from '@cloudcrafter/ui/components/input'
import { Label } from '@cloudcrafter/ui/components/label'
import { ScrollArea } from '@cloudcrafter/ui/components/scroll-area'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'
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
	Clipboard,
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
import { toast } from 'sonner'

// Define the types based on memories
export enum VariableType {
	BuildTime = 'BuildTime',
	Runtime = 'Runtime',
	Both = 'Both',
}

interface EnvVarGroup {
	id: string
	name: string
	description?: string
	inheritFromParent: boolean
}

interface EnvVar {
	id: string
	key: string
	value: string
	isSecret: boolean
	variableType: VariableType
	groupId?: string
	description?: string
	isInherited: boolean
	createdAt: string
	modifiedAt: string
}

export const EnvironmentVariables: React.FC<{
	stackDetails: StackDetailDto
}> = ({ stackDetails }) => {
	// State for environment variables and UI
	const [variables, setVariables] = useState<EnvVar[]>([])
	const [groups, setGroups] = useState<EnvVarGroup[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('all')
	const [showSecrets, setShowSecrets] = useState(false)
	const [includeInherited, setIncludeInherited] = useState(true)
	const [searchTerm, setSearchTerm] = useState('')
	const [groupView, setGroupView] = useState(true)
	const [addDialogOpen, setAddDialogOpen] = useState(false)
	const [editingVariable, setEditingVariable] = useState<EnvVar | null>(null)

	// Mock loading data - would be replaced with actual API call
	useEffect(() => {
		// Simulate loading environment variables
		const mockLoadData = async () => {
			setIsLoading(true)
			await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network request

			// Mock data
			const mockGroups: EnvVarGroup[] = [
				{
					id: 'g1',
					name: 'Database',
					description: 'Database connection settings',
					inheritFromParent: true,
				},
				{
					id: 'g2',
					name: 'API Keys',
					description: 'Third-party API credentials',
					inheritFromParent: false,
				},
				{
					id: 'g3',
					name: 'App Settings',
					description: 'Application configuration',
					inheritFromParent: true,
				},
			]

			const mockVars: EnvVar[] = [
				{
					id: 'v1',
					key: 'DATABASE_URL',
					value: 'postgres://user:pass@localhost:5432/db',
					isSecret: true,
					variableType: VariableType.Both,
					groupId: 'g1',
					description: 'PostgreSQL connection string',
					isInherited: false,
					createdAt: '2025-03-01T12:00:00Z',
					modifiedAt: '2025-03-01T12:00:00Z',
				},
				{
					id: 'v2',
					key: 'DATABASE_USER',
					value: 'admin',
					isSecret: false,
					variableType: VariableType.Both,
					groupId: 'g1',
					description: 'Database username',
					isInherited: false,
					createdAt: '2025-03-01T12:00:00Z',
					modifiedAt: '2025-03-01T12:00:00Z',
				},
				{
					id: 'v3',
					key: 'STRIPE_API_KEY',
					value: 'sk_test_123456789',
					isSecret: true,
					variableType: VariableType.Runtime,
					groupId: 'g2',
					description: 'Stripe secret key',
					isInherited: false,
					createdAt: '2025-03-01T12:00:00Z',
					modifiedAt: '2025-03-01T12:00:00Z',
				},
				{
					id: 'v4',
					key: 'LOG_LEVEL',
					value: 'info',
					isSecret: false,
					variableType: VariableType.BuildTime,
					groupId: 'g3',
					description: 'Application log level',
					isInherited: true,
					createdAt: '2025-03-01T12:00:00Z',
					modifiedAt: '2025-03-01T12:00:00Z',
				},
				{
					id: 'v5',
					key: 'APP_URL',
					value: 'https://example.com',
					isSecret: false,
					variableType: VariableType.Both,
					groupId: 'g3',
					description: 'Public URL for the application',
					isInherited: false,
					createdAt: '2025-03-01T12:00:00Z',
					modifiedAt: '2025-03-01T12:00:00Z',
				},
			]

			setGroups(mockGroups)
			setVariables(mockVars)
			setIsLoading(false)
		}

		mockLoadData()
	}, [])

	// New variable initial state
	const initialNewVariable = {
		id: '',
		key: '',
		value: '',
		isSecret: false,
		variableType: VariableType.Both,
		description: '',
		isInherited: false,
		createdAt: new Date().toISOString(),
		modifiedAt: new Date().toISOString(),
	}

	const [newVariable, setNewVariable] = useState<
		Omit<EnvVar, 'id' | 'createdAt' | 'modifiedAt' | 'isInherited'>
	>({
		key: '',
		value: '',
		isSecret: false,
		variableType: VariableType.Both,
		groupId: undefined,
		description: '',
	})

	// Filter variables based on search, tab, and other criteria
	const filteredVariables = variables.filter((variable) => {
		// Filter by search term
		const matchesSearch =
			searchTerm === '' ||
			variable.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
			variable.description?.toLowerCase().includes(searchTerm.toLowerCase())

		// Filter by tab
		const matchesTab =
			activeTab === 'all' ||
			(activeTab === 'runtime' &&
				(variable.variableType === VariableType.Runtime ||
					variable.variableType === VariableType.Both)) ||
			(activeTab === 'buildtime' &&
				(variable.variableType === VariableType.BuildTime ||
					variable.variableType === VariableType.Both)) ||
			(activeTab === 'secrets' && variable.isSecret)

		// Filter by inheritance
		const matchesInheritance = includeInherited || !variable.isInherited

		return matchesSearch && matchesTab && matchesInheritance
	})

	// Group variables by their group
	const variablesByGroup = groupView
		? groups
				.map((group) => ({
					group,
					variables: filteredVariables.filter((v) => v.groupId === group.id),
				}))
				.filter((g) => g.variables.length > 0)
		: null

	// Ungrouped variables
	const ungroupedVariables = filteredVariables.filter((v) => !v.groupId)

	// Handlers for CRUD operations
	const handleAddVariable = () => {
		// Validate the new variable
		if (!newVariable.key || !newVariable.key.match(/^[A-Z][A-Z0-9_]*$/)) {
			toast.error(
				'Key must start with a capital letter and contain only uppercase letters, numbers, and underscores',
			)
			return
		}

		if (newVariable.key.length > 100) {
			toast.error('Key must be 100 characters or less')
			return
		}

		if (newVariable.value.length > 2000) {
			toast.error('Value must be 2000 characters or less')
			return
		}

		if (variables.some((v) => v.key === newVariable.key)) {
			toast.error('A variable with this key already exists')
			return
		}

		// Add the new variable (in a real app, this would be an API call)
		const id = `v${variables.length + 1}`
		const timestamp = new Date().toISOString()

		setVariables([
			...variables,
			{
				...newVariable,
				id,
				isInherited: false,
				createdAt: timestamp,
				modifiedAt: timestamp,
			},
		])

		// Reset form and close dialog
		setNewVariable({
			key: '',
			value: '',
			isSecret: false,
			variableType: VariableType.Both,
			groupId: undefined,
			description: '',
		})

		setAddDialogOpen(false)
		toast.success('Variable added successfully')
	}

	const handleEditVariable = (variable: EnvVar) => {
		setEditingVariable(variable)
		setAddDialogOpen(true)
	}

	const handleUpdateVariable = () => {
		if (!editingVariable) return

		// Update the variable (in a real app, this would be an API call)
		setVariables(
			variables.map((v) =>
				v.id === editingVariable.id
					? { ...editingVariable, modifiedAt: new Date().toISOString() }
					: v,
			),
		)

		setEditingVariable(null)
		setAddDialogOpen(false)
		toast.success('Variable updated successfully')
	}

	const handleDeleteVariable = (id: string) => {
		// Delete the variable (in a real app, this would be an API call)
		setVariables(variables.filter((v) => v.id !== id))
		toast.success('Variable deleted successfully')
	}

	const handleToggleSecret = (id: string) => {
		setVariables(
			variables.map((v) =>
				v.id === id
					? {
							...v,
							isSecret: !v.isSecret,
							modifiedAt: new Date().toISOString(),
						}
					: v,
			),
		)
	}

	const handleCopyToClipboard = (value: string) => {
		navigator.clipboard.writeText(value)
		toast.success('Copied to clipboard')
	}

	const handleExportVariables = () => {
		// Create a JSON file with the variables
		const dataStr = JSON.stringify(variables, null, 2)
		const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

		const exportFileDefaultName = `${stackDetails.name}-env-vars-${new Date().toISOString().slice(0, 10)}.json`

		const linkElement = document.createElement('a')
		linkElement.setAttribute('href', dataUri)
		linkElement.setAttribute('download', exportFileDefaultName)
		linkElement.click()

		toast.success('Variables exported successfully')
	}

	// Render a masked value for secrets
	const renderValue = (variable: EnvVar) => {
		if (variable.isSecret && !showSecrets) {
			return '[HIDDEN]'
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
					<div className='flex gap-2'>
						<Button
							variant='outline'
							onClick={handleExportVariables}
							title='Export Variables'
						>
							<Download className='h-4 w-4 mr-2' />
							Export
						</Button>
						<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
							<DialogTrigger asChild>
								<Button onClick={() => setEditingVariable(null)}>
									<PlusCircle className='h-4 w-4 mr-2' />
									Add Variable
								</Button>
							</DialogTrigger>
							<DialogContent className='sm:max-w-[525px]'>
								<DialogHeader>
									<DialogTitle>
										{editingVariable ? 'Edit Variable' : 'Add New Variable'}
									</DialogTitle>
									<DialogDescription>
										{editingVariable
											? 'Update your environment variable details below.'
											: 'Create a new environment variable for your stack.'}
									</DialogDescription>
								</DialogHeader>
								<div className='grid gap-4 py-4'>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='key' className='text-right'>
											Key
										</Label>
										<Input
											id='key'
											className='col-span-3'
											value={
												editingVariable ? editingVariable.key : newVariable.key
											}
											onChange={(e) => {
												if (editingVariable) {
													setEditingVariable({
														...editingVariable,
														key: e.target.value,
													})
												} else {
													setNewVariable({
														...newVariable,
														key: e.target.value,
													})
												}
											}}
											placeholder='DATABASE_URL'
											disabled={editingVariable?.isInherited || false}
										/>
									</div>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='value' className='text-right'>
											Value
										</Label>
										<Input
											id='value'
											className='col-span-3'
											value={
												editingVariable
													? editingVariable.value
													: newVariable.value
											}
											onChange={(e) => {
												if (editingVariable) {
													setEditingVariable({
														...editingVariable,
														value: e.target.value,
													})
												} else {
													setNewVariable({
														...newVariable,
														value: e.target.value,
													})
												}
											}}
											placeholder='postgres://username:password@localhost:5432/mydatabase'
											disabled={editingVariable?.isInherited || false}
										/>
									</div>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='variable-type' className='text-right'>
											Type
										</Label>
										<Select
											value={
												editingVariable
													? editingVariable.variableType
													: newVariable.variableType
											}
											onValueChange={(value) => {
												if (editingVariable) {
													setEditingVariable({
														...editingVariable,
														variableType: value as VariableType,
													})
												} else {
													setNewVariable({
														...newVariable,
														variableType: value as VariableType,
													})
												}
											}}
											disabled={editingVariable?.isInherited || false}
										>
											<SelectTrigger className='col-span-3'>
												<SelectValue placeholder='Select type' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={VariableType.Both}>
													Both (Build & Runtime)
												</SelectItem>
												<SelectItem value={VariableType.BuildTime}>
													Build Time Only
												</SelectItem>
												<SelectItem value={VariableType.Runtime}>
													Runtime Only
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='group' className='text-right'>
											Group
										</Label>
										<Select
											value={
												editingVariable
													? editingVariable.groupId
													: newVariable.groupId
											}
											onValueChange={(value) => {
												if (editingVariable) {
													setEditingVariable({
														...editingVariable,
														groupId: value,
													})
												} else {
													setNewVariable({ ...newVariable, groupId: value })
												}
											}}
											disabled={editingVariable?.isInherited || false}
										>
											<SelectTrigger className='col-span-3'>
												<SelectValue placeholder='Select group (optional)' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value=''>No Group</SelectItem>
												{groups.map((group) => (
													<SelectItem key={group.id} value={group.id}>
														{group.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='description' className='text-right'>
											Description
										</Label>
										<Input
											id='description'
											className='col-span-3'
											value={
												editingVariable
													? editingVariable.description || ''
													: newVariable.description || ''
											}
											onChange={(e) => {
												if (editingVariable) {
													setEditingVariable({
														...editingVariable,
														description: e.target.value,
													})
												} else {
													setNewVariable({
														...newVariable,
														description: e.target.value,
													})
												}
											}}
											placeholder='Optional description'
											disabled={editingVariable?.isInherited || false}
										/>
									</div>
									<div className='grid grid-cols-4 items-center gap-4'>
										<Label htmlFor='is-secret' className='text-right'>
											Secret Value
										</Label>
										<div className='flex items-center space-x-2 col-span-3'>
											<Switch
												id='is-secret'
												checked={
													editingVariable
														? editingVariable.isSecret
														: newVariable.isSecret
												}
												onCheckedChange={(checked) => {
													if (editingVariable) {
														setEditingVariable({
															...editingVariable,
															isSecret: checked,
														})
													} else {
														setNewVariable({
															...newVariable,
															isSecret: checked,
														})
													}
												}}
												disabled={editingVariable?.isInherited || false}
											/>
											<Label htmlFor='is-secret'>
												Mask this value in logs and UI
											</Label>
										</div>
									</div>
								</div>
								<DialogFooter>
									<Button
										type='submit'
										onClick={
											editingVariable ? handleUpdateVariable : handleAddVariable
										}
										disabled={editingVariable?.isInherited || false}
									>
										{editingVariable ? 'Update Variable' : 'Add Variable'}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
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
								<Label htmlFor='show-secrets'>Show Secrets</Label>
							</div>
							<div className='flex items-center space-x-2'>
								<Switch
									id='include-inherited'
									checked={includeInherited}
									onCheckedChange={setIncludeInherited}
								/>
								<Label htmlFor='include-inherited'>Include Inherited</Label>
							</div>
							<div className='flex items-center space-x-2'>
								<Switch
									id='group-view'
									checked={groupView}
									onCheckedChange={setGroupView}
								/>
								<Label htmlFor='group-view'>Group View</Label>
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
							<TabsTrigger value='runtime'>Runtime</TabsTrigger>
							<TabsTrigger value='buildtime'>Build Time</TabsTrigger>
							<TabsTrigger value='secrets'>Secrets</TabsTrigger>
						</TabsList>

						<TabsContent value={activeTab} className='mt-4'>
							{isLoading ? (
								<div className='flex justify-center items-center h-48'>
									<RefreshCw className='h-8 w-8 animate-spin text-primary' />
								</div>
							) : filteredVariables.length === 0 ? (
								<div className='flex flex-col justify-center items-center h-48 text-muted-foreground'>
									<FileText className='h-12 w-12 mb-2' />
									<p>No environment variables found</p>
									<Button
										variant='outline'
										className='mt-4'
										onClick={() => setAddDialogOpen(true)}
									>
										<PlusCircle className='h-4 w-4 mr-2' />
										Add your first variable
									</Button>
								</div>
							) : groupView ? (
								<ScrollArea className='h-[50vh]'>
									<Accordion
										type='multiple'
										defaultValue={groups.map((g) => g.id)}
									>
										{variablesByGroup?.map(({ group, variables }) => (
											<AccordionItem value={group.id} key={group.id}>
												<AccordionTrigger>
													<div className='flex items-center'>
														<Group className='h-4 w-4 mr-2' />
														<span>{group.name}</span>
														<Badge variant='outline' className='ml-2'>
															{variables.length}
														</Badge>
														{group.inheritFromParent && (
															<Badge variant='secondary' className='ml-2'>
																Inheritable
															</Badge>
														)}
													</div>
												</AccordionTrigger>
												<AccordionContent>
													{group.description && (
														<div className='text-sm text-muted-foreground mb-4'>
															{group.description}
														</div>
													)}
													<VariablesTable
														variables={variables}
														renderValue={renderValue}
														onEdit={handleEditVariable}
														onDelete={handleDeleteVariable}
														onToggleSecret={handleToggleSecret}
														onCopy={handleCopyToClipboard}
													/>
												</AccordionContent>
											</AccordionItem>
										))}

										{ungroupedVariables.length > 0 && (
											<AccordionItem value='ungrouped'>
												<AccordionTrigger>
													<div className='flex items-center'>
														<span>Ungrouped</span>
														<Badge variant='outline' className='ml-2'>
															{ungroupedVariables.length}
														</Badge>
													</div>
												</AccordionTrigger>
												<AccordionContent>
													<VariablesTable
														variables={ungroupedVariables}
														renderValue={renderValue}
														onEdit={handleEditVariable}
														onDelete={handleDeleteVariable}
														onToggleSecret={handleToggleSecret}
														onCopy={handleCopyToClipboard}
													/>
												</AccordionContent>
											</AccordionItem>
										)}
									</Accordion>
								</ScrollArea>
							) : (
								<ScrollArea className='h-[50vh]'>
									<VariablesTable
										variables={filteredVariables}
										renderValue={renderValue}
										onEdit={handleEditVariable}
										onDelete={handleDeleteVariable}
										onToggleSecret={handleToggleSecret}
										onCopy={handleCopyToClipboard}
									/>
								</ScrollArea>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</CardContent>
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
					<TableCell className='font-mono'>
						<div className='flex items-center gap-2'>
							{variable.key}
							{variable.isSecret && (
								<Lock className='h-3 w-3 text-muted-foreground' />
							)}
							{variable.isInherited && (
								<Badge variant='secondary' className='text-xs'>
									Inherited
								</Badge>
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
								<Clipboard className='h-3 w-3' />
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
								disabled={variable.isInherited}
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
								disabled={variable.isInherited}
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
