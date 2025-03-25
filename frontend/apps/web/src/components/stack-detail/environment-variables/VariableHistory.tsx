'use client'

import type { StackDetailDto } from '@cloudcrafter/api'
import { Badge } from '@cloudcrafter/ui/components/badge'
import { Button } from '@cloudcrafter/ui/components/button'
import { Calendar } from '@cloudcrafter/ui/components/calendar'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@cloudcrafter/ui/components/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@cloudcrafter/ui/components/dropdown-menu'
import { Input } from '@cloudcrafter/ui/components/input'
import { Label } from '@cloudcrafter/ui/components/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@cloudcrafter/ui/components/popover'
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
import { cn } from '@cloudcrafter/ui/lib/utils'
import { format } from 'date-fns'
import {
	ArrowDownUp,
	Calendar as CalendarIcon,
	Check,
	Clock,
	Eye,
	EyeOff,
	FileText,
	Filter,
	RefreshCw,
	Search,
	User,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { VariableType } from './EnvironmentVariableSheet'

// Define the types for variable history
enum ChangeType {
	Created = 'Created',
	Updated = 'Updated',
	Deleted = 'Deleted',
}

interface EnvVarChangeRecord {
	id: string
	stackId: string
	variableId: string
	key: string
	oldValue?: string
	newValue?: string
	oldIsSecret?: boolean
	newIsSecret?: boolean
	oldType?: VariableType
	newType?: VariableType
	oldGroupId?: string
	newGroupId?: string
	changeType: ChangeType
	changedBy: string
	changedAt: string
	reason?: string
}

interface GroupInfo {
	id: string
	name: string
}

export const VariableHistory: React.FC<{ stackDetails: StackDetailDto }> = ({
	stackDetails,
}) => {
	// State
	const [records, setRecords] = useState<EnvVarChangeRecord[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState('')
	const [showSecrets, setShowSecrets] = useState(false)
	const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
	const [toDate, setToDate] = useState<Date | undefined>(undefined)
	const [selectedChangeType, setSelectedChangeType] = useState<string>('all')
	const [selectedVariable, setSelectedVariable] = useState<string>('all')
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
	const [groups, setGroups] = useState<GroupInfo[]>([])

	// Mock loading data - would be replaced with actual API call
	useEffect(() => {
		// Simulate loading history records
		const mockLoadData = async () => {
			setIsLoading(true)
			await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network request

			// Mock groups
			const mockGroups: GroupInfo[] = [
				{ id: 'g1', name: 'Database' },
				{ id: 'g2', name: 'API Keys' },
				{ id: 'g3', name: 'App Settings' },
			]

			// Mock data
			const mockRecords: EnvVarChangeRecord[] = generateMockHistoryRecords(
				stackDetails.id,
			)

			setGroups(mockGroups)
			setRecords(mockRecords)
			setIsLoading(false)
		}

		mockLoadData()
	}, [stackDetails.id])

	// Get unique variable keys for the filter dropdown
	const uniqueVariables = Array.from(
		new Set(records.map((record) => record.key)),
	)

	// Filter records based on all criteria
	const filteredRecords = records.filter((record) => {
		// Filter by search term
		const matchesSearch =
			searchTerm === '' ||
			record.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.changedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
			record.reason?.toLowerCase().includes(searchTerm.toLowerCase())

		// Filter by change type
		const matchesChangeType =
			selectedChangeType === 'all' || record.changeType === selectedChangeType

		// Filter by variable
		const matchesVariable =
			selectedVariable === 'all' || record.key === selectedVariable

		// Filter by date range
		const recordDate = new Date(record.changedAt)
		const matchesDateRange =
			(!fromDate || recordDate >= fromDate) &&
			(!toDate || recordDate <= new Date(toDate.setHours(23, 59, 59, 999)))

		return (
			matchesSearch && matchesChangeType && matchesVariable && matchesDateRange
		)
	})

	// Sort records
	const sortedRecords = [...filteredRecords].sort((a, b) => {
		const dateA = new Date(a.changedAt).getTime()
		const dateB = new Date(b.changedAt).getTime()
		return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
	})

	// Helper to get group name
	const getGroupName = (groupId?: string) => {
		if (!groupId) return 'No Group'
		const group = groups.find((g) => g.id === groupId)
		return group ? group.name : 'Unknown Group'
	}

	// Format the date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return format(date, 'PPP p') // Format: May 25, 2021 2:30 PM
	}

	// Render a masked value for secrets
	const renderValue = (
		value: string | undefined,
		isSecret: boolean | undefined,
	) => {
		if (!value) return '-'
		if (isSecret && !showSecrets) {
			return '[HIDDEN]'
		}
		return value
	}

	// Helper to get badge color based on change type
	const getChangeBadge = (changeType: ChangeType) => {
		switch (changeType) {
			case ChangeType.Created:
				return <Badge className='bg-green-600'>Created</Badge>
			case ChangeType.Updated:
				return <Badge className='bg-amber-600'>Updated</Badge>
			case ChangeType.Deleted:
				return <Badge className='bg-red-600'>Deleted</Badge>
			default:
				return <Badge>Unknown</Badge>
		}
	}

	// Helper to display type change
	const displayTypeChange = (
		oldType?: VariableType,
		newType?: VariableType,
	) => {
		if (!oldType && newType) {
			return <span>{getTypeBadge(newType)}</span>
		}

		if (oldType && !newType) {
			return (
				<span>
					{getTypeBadge(oldType)}{' '}
					<span className='text-muted-foreground'>→ Removed</span>
				</span>
			)
		}

		if (oldType && newType && oldType !== newType) {
			return (
				<div className='flex items-center gap-1'>
					{getTypeBadge(oldType)}
					<span className='text-muted-foreground mx-1'>→</span>
					{getTypeBadge(newType)}
				</div>
			)
		}

		if (oldType && newType && oldType === newType) {
			return <span>{getTypeBadge(oldType)}</span>
		}

		return '-'
	}

	// Helper to get type badge
	const getTypeBadge = (type: VariableType) => {
		switch (type) {
			case VariableType.Both:
				return (
					<Badge variant='default' className='text-xs'>
						Build & Runtime
					</Badge>
				)
			case VariableType.BuildTime:
				return (
					<Badge variant='outline' className='text-xs'>
						Build Time
					</Badge>
				)
			case VariableType.Runtime:
				return (
					<Badge variant='secondary' className='text-xs'>
						Runtime
					</Badge>
				)
			default:
				return null
		}
	}

	// Helper to display group change
	const displayGroupChange = (oldGroupId?: string, newGroupId?: string) => {
		if (!oldGroupId && !newGroupId) {
			return '-'
		}

		if (!oldGroupId && newGroupId) {
			return <span>Added to {getGroupName(newGroupId)}</span>
		}

		if (oldGroupId && !newGroupId) {
			return <span>Removed from {getGroupName(oldGroupId)}</span>
		}

		if (oldGroupId && newGroupId && oldGroupId !== newGroupId) {
			return (
				<span>
					{getGroupName(oldGroupId)} → {getGroupName(newGroupId)}
				</span>
			)
		}

		return getGroupName(oldGroupId)
	}

	// Helper to display secret status change
	const displaySecretChange = (
		oldIsSecret?: boolean,
		newIsSecret?: boolean,
	) => {
		if (oldIsSecret === undefined && newIsSecret === undefined) {
			return '-'
		}

		if (oldIsSecret === undefined && newIsSecret !== undefined) {
			return newIsSecret ? (
				<span className='flex items-center'>
					<Eye className='h-3 w-3 mr-1' /> Marked as secret
				</span>
			) : (
				'-'
			)
		}

		if (oldIsSecret !== undefined && newIsSecret === undefined) {
			return oldIsSecret ? (
				<span className='flex items-center'>
					<EyeOff className='h-3 w-3 mr-1' /> No longer secret
				</span>
			) : (
				'-'
			)
		}

		if (
			oldIsSecret !== undefined &&
			newIsSecret !== undefined &&
			oldIsSecret !== newIsSecret
		) {
			return newIsSecret ? (
				<span className='flex items-center'>
					<Eye className='h-3 w-3 mr-1' /> Marked as secret
				</span>
			) : (
				<span className='flex items-center'>
					<EyeOff className='h-3 w-3 mr-1' /> No longer secret
				</span>
			)
		}

		return oldIsSecret ? (
			<span className='flex items-center'>
				<Eye className='h-3 w-3 mr-1' /> Secret
			</span>
		) : (
			'-'
		)
	}

	// Properly type the event parameters
	const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value)
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<div>
						<CardTitle>Variable History</CardTitle>
						<CardDescription>
							View the complete history of changes to your environment
							variables.
						</CardDescription>
					</div>
					<Button
						variant='outline'
						onClick={() => {
							setIsLoading(true)
							setTimeout(() => setIsLoading(false), 1000)
						}}
						title='Refresh history'
					>
						<RefreshCw className='h-4 w-4 mr-2' />
						Refresh
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
						<div className='relative w-full sm:w-80'>
							<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search history...'
								value={searchTerm}
								onChange={handleFilterChange}
								className='pl-8'
							/>
						</div>

						<div className='flex flex-wrap gap-2 w-full sm:w-auto'>
							<Popover>
								<PopoverTrigger asChild>
									<Button variant='outline' size='sm' className='h-9'>
										<Filter className='h-4 w-4 mr-2' />
										Filters
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-80 p-4' align='end'>
									<div className='space-y-4'>
										<div className='space-y-2'>
											<Label>Change Type</Label>
											<Select
												value={selectedChangeType}
												onValueChange={setSelectedChangeType}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select change type' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='all'>All Changes</SelectItem>
													<SelectItem value={ChangeType.Created}>
														Created
													</SelectItem>
													<SelectItem value={ChangeType.Updated}>
														Updated
													</SelectItem>
													<SelectItem value={ChangeType.Deleted}>
														Deleted
													</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className='space-y-2'>
											<Label>Variable</Label>
											<Select
												value={selectedVariable}
												onValueChange={setSelectedVariable}
											>
												<SelectTrigger>
													<SelectValue placeholder='Select variable' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='all'>All Variables</SelectItem>
													{uniqueVariables.map((variable) => (
														<SelectItem key={variable} value={variable}>
															{variable}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>

										<div className='grid grid-cols-2 gap-2'>
											<div className='space-y-2'>
												<Label>From Date</Label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant='outline'
															className={cn(
																'w-full justify-start text-left font-normal',
																!fromDate && 'text-muted-foreground',
															)}
														>
															<CalendarIcon className='mr-2 h-4 w-4' />
															{fromDate
																? format(fromDate, 'PPP')
																: 'Pick a date'}
														</Button>
													</PopoverTrigger>
													<PopoverContent className='w-auto p-0'>
														<Calendar
															mode='single'
															selected={fromDate}
															onSelect={setFromDate}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
											</div>
											<div className='space-y-2'>
												<Label>To Date</Label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant='outline'
															className={cn(
																'w-full justify-start text-left font-normal',
																!toDate && 'text-muted-foreground',
															)}
														>
															<CalendarIcon className='mr-2 h-4 w-4' />
															{toDate ? format(toDate, 'PPP') : 'Pick a date'}
														</Button>
													</PopoverTrigger>
													<PopoverContent className='w-auto p-0'>
														<Calendar
															mode='single'
															selected={toDate}
															onSelect={setToDate}
															initialFocus
														/>
													</PopoverContent>
												</Popover>
											</div>
										</div>

										<div className='pt-2 flex justify-between'>
											<Button
												variant='ghost'
												onClick={() => {
													setSelectedChangeType('all')
													setSelectedVariable('all')
													setFromDate(undefined)
													setToDate(undefined)
												}}
											>
												Reset Filters
											</Button>
											<Button onClick={() => {}}>Apply</Button>
										</div>
									</div>
								</PopoverContent>
							</Popover>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='outline' size='sm' className='h-9'>
										<ArrowDownUp className='h-4 w-4 mr-2' />
										{sortDirection === 'desc' ? 'Newest First' : 'Oldest First'}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuLabel>Sort Order</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem onClick={() => setSortDirection('desc')}>
											Newest First
											{sortDirection === 'desc' && (
												<Check className='h-4 w-4 ml-2' />
											)}
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => setSortDirection('asc')}>
											Oldest First
											{sortDirection === 'asc' && (
												<Check className='h-4 w-4 ml-2' />
											)}
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>

							<div className='flex items-center space-x-2'>
								<Switch
									id='show-secrets'
									checked={showSecrets}
									onCheckedChange={setShowSecrets}
								/>
								<Label htmlFor='show-secrets' className='text-sm'>
									Show Secrets
								</Label>
							</div>
						</div>
					</div>

					{isLoading ? (
						<div className='flex justify-center items-center h-64'>
							<RefreshCw className='h-8 w-8 animate-spin text-primary' />
						</div>
					) : sortedRecords.length === 0 ? (
						<div className='flex flex-col justify-center items-center h-64 text-muted-foreground'>
							<FileText className='h-12 w-12 mb-2' />
							<p>No history records found</p>
						</div>
					) : (
						<ScrollArea className='h-[60vh]'>
							<Table>
								<TableHeader className='sticky top-0 bg-background'>
									<TableRow>
										<TableHead>Date & Time</TableHead>
										<TableHead>Variable</TableHead>
										<TableHead>Change</TableHead>
										<TableHead>Value</TableHead>
										<TableHead>Properties</TableHead>
										<TableHead>User</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sortedRecords.map((record) => (
										<TableRow key={record.id}>
											<TableCell className='whitespace-nowrap'>
												<div className='flex flex-col'>
													<span className='flex items-center gap-1'>
														<Clock className='h-3 w-3' />
														{formatDate(record.changedAt)}
													</span>
												</div>
											</TableCell>

											<TableCell>
												<div className='font-mono text-sm'>{record.key}</div>
											</TableCell>

											<TableCell>
												<div className='flex flex-col gap-1'>
													{getChangeBadge(record.changeType)}
													{record.reason && (
														<div className='text-xs text-muted-foreground mt-1'>
															{record.reason}
														</div>
													)}
												</div>
											</TableCell>

											<TableCell>
												{record.changeType === ChangeType.Created && (
													<div className='font-mono text-sm'>
														{renderValue(record.newValue, record.newIsSecret)}
													</div>
												)}

												{record.changeType === ChangeType.Updated &&
													record.oldValue !== record.newValue && (
														<div className='font-mono text-sm'>
															<div className='line-through text-muted-foreground'>
																{renderValue(
																	record.oldValue,
																	record.oldIsSecret,
																)}
															</div>
															<div>
																{renderValue(
																	record.newValue,
																	record.newIsSecret,
																)}
															</div>
														</div>
													)}

												{record.changeType === ChangeType.Deleted && (
													<div className='font-mono text-sm'>
														<div className='line-through text-muted-foreground'>
															{renderValue(record.oldValue, record.oldIsSecret)}
														</div>
													</div>
												)}
											</TableCell>

											<TableCell>
												<div className='space-y-1 text-sm'>
													{(record.oldType !== record.newType ||
														(record.changeType === ChangeType.Created &&
															record.newType) ||
														(record.changeType === ChangeType.Deleted &&
															record.oldType)) && (
														<div>
															{displayTypeChange(
																record.oldType,
																record.newType,
															)}
														</div>
													)}

													{(record.oldIsSecret !== record.newIsSecret ||
														(record.changeType === ChangeType.Created &&
															record.newIsSecret) ||
														(record.changeType === ChangeType.Deleted &&
															record.oldIsSecret)) && (
														<div>
															{displaySecretChange(
																record.oldIsSecret,
																record.newIsSecret,
															)}
														</div>
													)}

													{(record.oldGroupId !== record.newGroupId ||
														(record.changeType === ChangeType.Created &&
															record.newGroupId) ||
														(record.changeType === ChangeType.Deleted &&
															record.oldGroupId)) && (
														<div className='text-xs'>
															Group:{' '}
															{displayGroupChange(
																record.oldGroupId,
																record.newGroupId,
															)}
														</div>
													)}
												</div>
											</TableCell>

											<TableCell>
												<div className='flex items-center'>
													<User className='h-3 w-3 mr-1' />
													<span>{record.changedBy}</span>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</ScrollArea>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

// Helper to generate mock history records for testing
function generateMockHistoryRecords(stackId: string): EnvVarChangeRecord[] {
	const users = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Taylor Swift']
	const variables = [
		{ id: 'v1', key: 'DATABASE_URL' },
		{ id: 'v2', key: 'DATABASE_USER' },
		{ id: 'v3', key: 'STRIPE_API_KEY' },
		{ id: 'v4', key: 'LOG_LEVEL' },
		{ id: 'v5', key: 'APP_URL' },
	]

	const records: EnvVarChangeRecord[] = []
	let recordId = 1

	// Generate a series of events for each variable
	variables.forEach((variable) => {
		// Creation record
		const creationDate = new Date()
		creationDate.setDate(
			creationDate.getDate() - Math.floor(Math.random() * 60),
		) // Random date within last 60 days

		records.push({
			id: `r${recordId++}`,
			stackId,
			variableId: variable.id,
			key: variable.key,
			newValue:
				variable.key === 'DATABASE_URL'
					? 'postgres://user:pass@localhost:5432/db'
					: variable.key === 'DATABASE_USER'
						? 'admin'
						: variable.key === 'STRIPE_API_KEY'
							? 'sk_test_123456789'
							: variable.key === 'LOG_LEVEL'
								? 'info'
								: 'https://example.com',
			newIsSecret:
				variable.key === 'DATABASE_URL' || variable.key === 'STRIPE_API_KEY',
			newType:
				variable.key === 'LOG_LEVEL'
					? VariableType.BuildTime
					: variable.key === 'STRIPE_API_KEY'
						? VariableType.Runtime
						: VariableType.Both,
			newGroupId: variable.key.includes('DATABASE')
				? 'g1'
				: variable.key.includes('STRIPE')
					? 'g2'
					: variable.key === 'APP_URL' || variable.key === 'LOG_LEVEL'
						? 'g3'
						: undefined,
			changeType: ChangeType.Created,
			changedBy: users[Math.floor(Math.random() * users.length)],
			changedAt: creationDate.toISOString(),
			reason: `Initial creation of ${variable.key}`,
		})

		// Add some update records for some variables
		if (Math.random() > 0.3) {
			// 70% chance of at least one update
			const updateDate = new Date(creationDate)
			updateDate.setDate(
				updateDate.getDate() + Math.floor(Math.random() * 30) + 1,
			) // 1-30 days after creation

			if (updateDate <= new Date()) {
				// Only if update date is in the past
				records.push({
					id: `r${recordId++}`,
					stackId,
					variableId: variable.id,
					key: variable.key,
					oldValue:
						variable.key === 'DATABASE_URL'
							? 'postgres://user:pass@localhost:5432/db'
							: variable.key === 'DATABASE_USER'
								? 'admin'
								: variable.key === 'STRIPE_API_KEY'
									? 'sk_test_123456789'
									: variable.key === 'LOG_LEVEL'
										? 'info'
										: 'https://example.com',
					newValue:
						variable.key === 'DATABASE_URL'
							? 'postgres://admin:securepass@db.example.com:5432/production'
							: variable.key === 'DATABASE_USER'
								? 'dbadmin'
								: variable.key === 'STRIPE_API_KEY'
									? 'sk_live_987654321'
									: variable.key === 'LOG_LEVEL'
										? 'debug'
										: 'https://production.example.com',
					oldIsSecret:
						variable.key === 'DATABASE_URL' ||
						variable.key === 'STRIPE_API_KEY',
					newIsSecret:
						variable.key === 'DATABASE_URL' ||
						variable.key === 'STRIPE_API_KEY',
					oldType:
						variable.key === 'LOG_LEVEL'
							? VariableType.BuildTime
							: variable.key === 'STRIPE_API_KEY'
								? VariableType.Runtime
								: VariableType.Both,
					newType:
						variable.key === 'LOG_LEVEL'
							? VariableType.Both
							: variable.key === 'STRIPE_API_KEY'
								? VariableType.Runtime
								: VariableType.Both,
					oldGroupId: variable.key.includes('DATABASE')
						? 'g1'
						: variable.key.includes('STRIPE')
							? 'g2'
							: variable.key === 'APP_URL' || variable.key === 'LOG_LEVEL'
								? 'g3'
								: undefined,
					newGroupId: variable.key.includes('DATABASE')
						? 'g1'
						: variable.key.includes('STRIPE')
							? 'g2'
							: variable.key === 'APP_URL' || variable.key === 'LOG_LEVEL'
								? 'g3'
								: undefined,
					changeType: ChangeType.Updated,
					changedBy: users[Math.floor(Math.random() * users.length)],
					changedAt: updateDate.toISOString(),
					reason:
						Math.random() > 0.5
							? `Updated ${variable.key} for production environment`
							: undefined,
				})
			}
		}

		// Add deletion record for one variable
		if (variable.key === 'LOG_LEVEL') {
			const deleteDate = new Date()
			deleteDate.setDate(deleteDate.getDate() - Math.floor(Math.random() * 10)) // Random date within last 10 days

			records.push({
				id: `r${recordId++}`,
				stackId,
				variableId: variable.id,
				key: variable.key,
				oldValue: 'debug',
				oldIsSecret: false,
				oldType: VariableType.Both,
				oldGroupId: 'g3',
				changeType: ChangeType.Deleted,
				changedBy: users[Math.floor(Math.random() * users.length)],
				changedAt: deleteDate.toISOString(),
				reason: 'No longer needed as we standardized logging',
			})
		}
	})

	return records
}
