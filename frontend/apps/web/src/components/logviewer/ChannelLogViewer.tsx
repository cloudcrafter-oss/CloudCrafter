import { useWebHub } from '@/src/hooks/useWebHub'
import { useGetDeploymentLogsHook } from '@cloudcrafter/api'
import { channelOutputLogLineLevelEnum } from '@cloudcrafter/api'
import type { DeploymentLogDto } from '@cloudcrafter/api'
import { Badge } from '@cloudcrafter/ui/components/badge'
import { Button } from '@cloudcrafter/ui/components/button'
import { Checkbox } from '@cloudcrafter/ui/components/checkbox'
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
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from '@cloudcrafter/ui/components/sheet'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@cloudcrafter/ui/components/tooltip'
import { LazyLog } from '@melloware/react-logviewer'
import chalk from 'chalk'
import dayjs from 'dayjs'
import {
	AlertCircle,
	ArrowUp,
	Copy,
	Download,
	Loader2,
	RefreshCw,
	Search,
	X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type LogLevel =
	(typeof channelOutputLogLineLevelEnum)[keyof typeof channelOutputLogLineLevelEnum]

const LOG_LEVEL_COLORS = {
	[channelOutputLogLineLevelEnum.Verbose]:
		'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
	[channelOutputLogLineLevelEnum.Debug]:
		'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
	[channelOutputLogLineLevelEnum.Information]:
		'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
	[channelOutputLogLineLevelEnum.Warning]:
		'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
	[channelOutputLogLineLevelEnum.Error]:
		'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
	[channelOutputLogLineLevelEnum.Fatal]:
		'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
}

const formatLogMessage = (message: DeploymentLogDto) => {
	const date = new Date(message.at)
	const formattedDate = dayjs(date).format('DD-MM-YYYY HH:mm:ss')

	const output = `${formattedDate} => ${message.message}`

	const redLevels = [
		channelOutputLogLineLevelEnum.Error,
		channelOutputLogLineLevelEnum.Fatal,
	] as const

	if (redLevels.includes(message.level as (typeof redLevels)[number])) {
		return chalk.red(output)
	}

	return output
}

export const ChannelLogViewerEnhanced = ({
	channelId,
	show,
	onHide,
}: { channelId: string; show: boolean; onHide: () => void }) => {
	return (
		<Sheet open={show} onOpenChange={onHide}>
			<SheetContent className='min-w-[800px] sm:max-w-[900px] md:max-w-[1000px] lg:max-w-[1200px]'>
				<SheetHeader>
					<SheetTitle>Logs</SheetTitle>
				</SheetHeader>
				{channelId.length > 0 && <ChannelLogViewer channelId={channelId} />}
			</SheetContent>
		</Sheet>
	)
}

export const ChannelLogViewer = ({ channelId }: { channelId: string }) => {
	const { messages } = useWebHub({
		channelId,
	})

	const isConnected = true

	const { data, isLoading, error, refetch } =
		useGetDeploymentLogsHook(channelId)

	// State for enhanced features
	const [searchTerm, setSearchTerm] = useState('')
	const [autoScroll, setAutoScroll] = useState(true)
	const [autoScrollPaused, setAutoScrollPaused] = useState(false)
	const [selectedLevels, setSelectedLevels] = useState<LogLevel[]>(
		Object.values(channelOutputLogLineLevelEnum) as LogLevel[],
	)
	const [timeFormat, setTimeFormat] = useState('DD-MM-YYYY HH:mm:ss')
	const [refreshInterval, setRefreshInterval] = useState<number | null>(null)
	const [activeTab, setActiveTab] = useState('all')
	const logViewerRef = useRef<HTMLDivElement>(null)
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	// Setup auto-refresh
	useEffect(() => {
		if (refreshInterval) {
			const interval = setInterval(() => {
				refetch()
			}, refreshInterval)
			return () => clearInterval(interval)
		}
	}, [refreshInterval, refetch])

	// Process and filter logs
	const processedLogs = useMemo(() => {
		const linesFromApi = data ?? []
		const allLines = [...linesFromApi, ...messages]

		// Sort by date
		allLines.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())

		// Filter by log level
		const filteredByLevel = allLines.filter((log) =>
			selectedLevels.includes(log.level as LogLevel),
		)

		// Filter by search term
		const filteredBySearch = searchTerm
			? filteredByLevel.filter(
					(log) =>
						log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
						dayjs(new Date(log.at))
							.format(timeFormat)
							.toLowerCase()
							.includes(searchTerm.toLowerCase()),
				)
			: filteredByLevel

		return filteredBySearch
	}, [data, messages, selectedLevels, searchTerm, timeFormat])

	// Format logs based on current settings
	const formattedLogs = useMemo(() => {
		return processedLogs.map((log) => {
			const date = new Date(log.at)
			const formattedDate = dayjs(date).format(timeFormat)
			return {
				...log,
				formattedText: `${formattedDate} => ${log.message}`,
			}
		})
	}, [processedLogs, timeFormat])

	// Create the log text for LazyLog
	const logText = useMemo(() => {
		return formattedLogs
			.map((log) => {
				const redLevels = [
					channelOutputLogLineLevelEnum.Error,
					channelOutputLogLineLevelEnum.Fatal,
				] as const

				if (redLevels.includes(log.level as (typeof redLevels)[number])) {
					return chalk.red(log.formattedText)
				}

				return log.formattedText
			})
			.join('\n')
	}, [formattedLogs])

	// Handle copy to clipboard
	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(logText)
			.then(() => {
				// Could add a toast notification here
				console.log('Logs copied to clipboard')
			})
			.catch((err) => {
				console.error('Failed to copy logs: ', err)
			})
	}

	// Handle download logs
	const downloadLogs = () => {
		const blob = new Blob([logText], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `logs-${channelId}-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.txt`
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
		URL.revokeObjectURL(url)
	}

	// Toggle log level filter
	const toggleLogLevel = (level: LogLevel) => {
		setSelectedLevels((prev) =>
			prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
		)
	}

	// Reset all filters
	const resetFilters = () => {
		setSearchTerm('')
		setSelectedLevels(
			Object.values(channelOutputLogLineLevelEnum) as LogLevel[],
		)
		setTimeFormat('DD-MM-YYYY HH:mm:ss')
	}

	// Handle scroll events to temporarily disable auto-scroll when manually scrolling
	const handleScroll = useCallback(
		(args: {
			scrollTop: number
			scrollHeight: number
			clientHeight: number
		}) => {
			// If we're at the bottom or very close to it
			const isAtBottom =
				args.scrollHeight - args.scrollTop - args.clientHeight < 50

			if (autoScroll) {
				if (!isAtBottom && !autoScrollPaused) {
					// User is scrolling up, pause auto-scroll
					setAutoScrollPaused(true)
				} else if (isAtBottom && autoScrollPaused) {
					// User scrolled back to bottom, resume auto-scroll
					setAutoScrollPaused(false)
				}
			}

			// Clear any existing timeout
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}
		},
		[autoScroll, autoScrollPaused],
	)

	// Effect to handle auto-scroll toggle changes
	useEffect(() => {
		if (autoScroll && autoScrollPaused) {
			// When auto-scroll is manually turned on, reset the paused state
			setAutoScrollPaused(false)
		}
	}, [autoScroll, autoScrollPaused])

	// Scroll to top function
	const scrollToTop = useCallback(() => {
		const scrollContainer = logViewerRef.current?.querySelector(
			'.ReactVirtualized__Grid',
		)
		if (scrollContainer) {
			scrollContainer.scrollTop = 0
			setAutoScrollPaused(true)
		}
	}, [])

	// Resume auto-scroll function
	const resumeAutoScroll = useCallback(() => {
		setAutoScrollPaused(false)

		// Scroll to bottom
		const scrollContainer = logViewerRef.current?.querySelector(
			'.ReactVirtualized__Grid',
		)
		if (scrollContainer) {
			scrollContainer.scrollTop = scrollContainer.scrollHeight
		}
	}, [])

	return (
		<div className='flex flex-col h-full space-y-4'>
			{/* Controls */}
			<div className='flex flex-col space-y-2'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-2'>
						<div className='relative w-64'>
							<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search logs...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='pl-8'
							/>
							{searchTerm && (
								<button
									type='button'
									onClick={() => setSearchTerm('')}
									className='absolute right-2 top-2.5'
								>
									<X className='h-4 w-4 text-muted-foreground' />
								</button>
							)}
						</div>

						<Select
							value={timeFormat}
							onValueChange={(value) => setTimeFormat(value)}
						>
							<SelectTrigger className='w-52'>
								<SelectValue placeholder='Time format' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='DD-MM-YYYY HH:mm:ss'>
									DD-MM-YYYY HH:mm:ss
								</SelectItem>
								<SelectItem value='MM/DD/YYYY HH:mm:ss'>
									MM/DD/YYYY HH:mm:ss
								</SelectItem>
								<SelectItem value='YYYY-MM-DD HH:mm:ss'>
									YYYY-MM-DD HH:mm:ss
								</SelectItem>
								<SelectItem value='HH:mm:ss'>HH:mm:ss (Time only)</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='flex items-center space-x-2'>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant='outline'
										size='icon'
										onClick={copyToClipboard}
									>
										<Copy className='h-4 w-4' />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Copy logs to clipboard</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant='outline' size='icon' onClick={downloadLogs}>
										<Download className='h-4 w-4' />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Download logs</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant='outline'
										size='icon'
										onClick={() => refetch()}
										disabled={isLoading}
									>
										{isLoading ? (
											<Loader2 className='h-4 w-4 animate-spin' />
										) : (
											<RefreshCw className='h-4 w-4' />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Refresh logs</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<Button variant='outline' size='sm' onClick={resetFilters}>
							Reset Filters
						</Button>
					</div>
				</div>

				<div className='flex flex-wrap gap-2'>
					<div className='flex items-center space-x-2'>
						<Checkbox
							id='auto-scroll'
							checked={autoScroll}
							onCheckedChange={(checked) => setAutoScroll(checked as boolean)}
						/>
						<Label htmlFor='auto-scroll' className='flex items-center'>
							Auto-scroll
							{autoScroll && autoScrollPaused && (
								<Badge
									variant='outline'
									className='ml-2 text-xs bg-yellow-100 text-yellow-800'
								>
									Paused (scrolling)
								</Badge>
							)}
						</Label>

						{autoScroll && (
							<>
								{autoScrollPaused ? (
									<Button
										variant='ghost'
										size='sm'
										className='h-6 px-2 text-xs'
										onClick={resumeAutoScroll}
									>
										Resume
									</Button>
								) : (
									<Button
										variant='ghost'
										size='sm'
										className='h-6 px-2 text-xs'
										onClick={scrollToTop}
									>
										<ArrowUp className='h-3 w-3 mr-1' /> Top
									</Button>
								)}
							</>
						)}
					</div>

					<div className='flex items-center space-x-1 ml-4'>
						<span className='text-sm font-medium'>Log Levels:</span>
						{Object.values(channelOutputLogLineLevelEnum).map((level) => (
							<Badge
								key={level}
								variant='outline'
								className={`cursor-pointer ${selectedLevels.includes(level as LogLevel) ? LOG_LEVEL_COLORS[level as LogLevel] : 'opacity-50'}`}
								onClick={() => toggleLogLevel(level as LogLevel)}
							>
								{level}
							</Badge>
						))}
					</div>

					<div className='flex items-center space-x-2 ml-4'>
						<span className='text-sm font-medium'>Auto-refresh:</span>
						<Select
							value={refreshInterval?.toString() || 'off'}
							onValueChange={(value) =>
								setRefreshInterval(
									value === 'off' ? null : Number.parseInt(value),
								)
							}
						>
							<SelectTrigger className='w-32'>
								<SelectValue placeholder='Refresh rate' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='off'>Off</SelectItem>
								<SelectItem value='5000'>5 seconds</SelectItem>
								<SelectItem value='10000'>10 seconds</SelectItem>
								<SelectItem value='30000'>30 seconds</SelectItem>
								<SelectItem value='60000'>1 minute</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Connection status */}
			<div className='flex items-center'>
				<div
					className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
				/>
				<span className='text-sm text-muted-foreground'>
					{isConnected ? 'Connected' : 'Disconnected'} - {processedLogs.length}{' '}
					logs
				</span>
			</div>

			{/* Log viewer */}
			<div
				className='relative flex-1 min-h-[500px] border rounded-md'
				ref={logViewerRef}
			>
				{error ? (
					<div className='flex flex-col items-center justify-center h-full p-4'>
						<AlertCircle className='h-8 w-8 text-red-500 mb-2' />
						<p className='text-center text-muted-foreground'>
							Error loading logs. Please try again.
						</p>
						<Button
							variant='outline'
							className='mt-2'
							onClick={() => refetch()}
						>
							Retry
						</Button>
					</div>
				) : isLoading && !processedLogs.length ? (
					<div className='flex items-center justify-center h-full'>
						<Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
					</div>
				) : processedLogs.length === 0 ? (
					<div className='flex flex-col items-center justify-center h-full p-4'>
						<p className='text-center text-muted-foreground'>
							No logs available
						</p>
					</div>
				) : (
					<>
						<LazyLog
							text={logText}
							height={500}
							width='100%'
							follow={autoScroll && !autoScrollPaused}
							enableSearch={true}
							highlightLineClassName='bg-blue-100 dark:bg-blue-900'
							extraLines={5}
							caseInsensitive={true}
							selectableLines={true}
							onScroll={handleScroll}
							formatPart={(text) => {
								// This is a simple example - you could enhance this to highlight specific patterns
								if (text.includes('error') || text.includes('Error')) {
									return <span style={{ color: 'red' }}>{text}</span>
								}
								if (text.includes('warning') || text.includes('Warning')) {
									return <span style={{ color: 'orange' }}>{text}</span>
								}
								return <span>{text}</span>
							}}
						/>

						{/* Floating navigation buttons */}
						<div className='absolute bottom-4 right-4 flex flex-col gap-2'>
							{autoScroll && autoScrollPaused && (
								<Button
									variant='secondary'
									size='sm'
									className='opacity-80 hover:opacity-100'
									onClick={resumeAutoScroll}
								>
									Resume Auto-scroll
								</Button>
							)}

							<Button
								variant='secondary'
								size='sm'
								className='opacity-80 hover:opacity-100'
								onClick={scrollToTop}
							>
								<ArrowUp className='h-4 w-4 mr-1' /> Scroll to Top
							</Button>
						</div>
					</>
				)}
			</div>

			<SheetFooter>
				<div className='flex justify-between w-full text-xs text-muted-foreground'>
					<span>Channel ID: {channelId}</span>
					<span>Last updated: {dayjs().format('HH:mm:ss')}</span>
				</div>
			</SheetFooter>
		</div>
	)
}
