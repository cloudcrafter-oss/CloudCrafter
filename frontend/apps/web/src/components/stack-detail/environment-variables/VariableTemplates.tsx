'use client'

import type { StackDetailDto } from '@cloudcrafter/api'
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '@cloudcrafter/ui/components/alert'
import { Badge } from '@cloudcrafter/ui/components/badge'
import { Button } from '@cloudcrafter/ui/components/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
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
} from '@cloudcrafter/ui/components/dialog'
import { Input } from '@cloudcrafter/ui/components/input'
import { Label } from '@cloudcrafter/ui/components/label'
import { ScrollArea } from '@cloudcrafter/ui/components/scroll-area'
import { Textarea } from '@cloudcrafter/ui/components/textarea'
import {
	AlertCircle,
	Check,
	FileText,
	Info,
	RefreshCw,
	Search,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { VariableType } from './EnvironmentVariables'

// Define the template structure
interface TemplateVariable {
	key: string
	defaultValue: string
	isSecret: boolean
	variableType: VariableType
	description?: string
	required: boolean
	validationPattern?: string
	validationMessage?: string
}

interface VariableTemplateGroup {
	id: string
	name: string
	description?: string
	inheritFromParent: boolean
}

interface VariableTemplate {
	id: string
	name: string
	description: string
	variables: TemplateVariable[]
	groups: VariableTemplateGroup[]
	createdAt: string
	modifiedAt: string
	usageCount: number
}

export const VariableTemplates: React.FC<{ stackDetails: StackDetailDto }> = ({
	stackDetails,
}) => {
	// State
	const [templates, setTemplates] = useState<VariableTemplate[]>(mockTemplates)
	const [selectedTemplate, setSelectedTemplate] =
		useState<VariableTemplate | null>(null)
	const [applyDialogOpen, setApplyDialogOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [customValues, setCustomValues] = useState<Record<string, string>>({})

	// Filter templates based on search term
	const filteredTemplates = templates.filter(
		(template) =>
			template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			template.description.toLowerCase().includes(searchTerm.toLowerCase()),
	)

	// Handle template application
	const handleApplyTemplate = (template: VariableTemplate) => {
		setSelectedTemplate(template)

		// Initialize custom values with default values
		const initialValues: Record<string, string> = {}
		template.variables.forEach((variable) => {
			initialValues[variable.key] = variable.defaultValue
		})
		setCustomValues(initialValues)

		setApplyDialogOpen(true)
	}

	const handleConfirmApply = async () => {
		if (!selectedTemplate) return

		// Validate required fields
		const missingRequired = selectedTemplate.variables
			.filter((variable) => variable.required && !customValues[variable.key])
			.map((variable) => variable.key)

		if (missingRequired.length > 0) {
			toast.error(`Missing required variables: ${missingRequired.join(', ')}`)
			return
		}

		// Validate patterns
		const invalidValues = selectedTemplate.variables
			.filter((variable) => {
				if (!variable.validationPattern) return false
				const pattern = new RegExp(variable.validationPattern)
				return !pattern.test(customValues[variable.key])
			})
			.map((variable) => ({
				key: variable.key,
				message:
					variable.validationMessage || `Invalid format for ${variable.key}`,
			}))

		if (invalidValues.length > 0) {
			toast.error(invalidValues[0].message)
			return
		}

		// Apply the template (in a real app, this would be an API call)
		setIsLoading(true)

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500))

			// Update usage count for the template
			setTemplates(
				templates.map((t) =>
					t.id === selectedTemplate.id
						? { ...t, usageCount: t.usageCount + 1 }
						: t,
				),
			)

			setApplyDialogOpen(false)
			toast.success(
				`Successfully applied ${selectedTemplate.name} template to your stack`,
			)
		} catch (error) {
			toast.error('Failed to apply template')
		} finally {
			setIsLoading(false)
		}
	}

	const handleVariableValueChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
		key: string,
	) => {
		const updatedValues = { ...customValues }
		updatedValues[key] = e.target.value
		setCustomValues(updatedValues)
	}

	return (
		<Card className='w-full'>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<div>
						<CardTitle>Variable Templates</CardTitle>
						<CardDescription>
							Apply pre-defined templates to quickly set up common
							configurations.
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<div className='relative'>
						<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search templates...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='pl-8'
						/>
					</div>

					<Alert>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Information</AlertTitle>
						<AlertDescription>
							Templates provide pre-configured sets of environment variables for
							common use cases. Select a template and customize it to match your
							specific needs.
						</AlertDescription>
					</Alert>

					{filteredTemplates.length === 0 ? (
						<div className='flex flex-col justify-center items-center h-48 text-muted-foreground'>
							<FileText className='h-12 w-12 mb-2' />
							<p>No templates found</p>
						</div>
					) : (
						<ScrollArea className='h-[50vh]'>
							<div className='grid gap-4 md:grid-cols-2'>
								{filteredTemplates.map((template) => (
									<Card key={template.id} className='overflow-hidden'>
										<CardHeader className='p-4'>
											<CardTitle className='text-lg'>{template.name}</CardTitle>
											<div className='flex items-center space-x-2'>
												<Badge variant='outline'>
													{template.variables.length} Variables
												</Badge>
												<Badge variant='secondary'>
													{template.usageCount} Uses
												</Badge>
											</div>
										</CardHeader>
										<CardContent className='p-4 pt-0'>
											<p className='text-sm text-muted-foreground mb-4'>
												{template.description}
											</p>
											<div className='space-y-1'>
												{template.variables.slice(0, 3).map((variable) => (
													<div
														key={variable.key}
														className='text-xs flex items-center'
													>
														<span className='font-mono'>{variable.key}</span>
														{variable.required && (
															<Badge
																variant='destructive'
																className='ml-2 text-[10px] py-0'
															>
																Required
															</Badge>
														)}
													</div>
												))}
												{template.variables.length > 3 && (
													<p className='text-xs text-muted-foreground'>
														And {template.variables.length - 3} more...
													</p>
												)}
											</div>
										</CardContent>
										<CardFooter className='p-4 pt-0 flex justify-end'>
											<Button
												onClick={() => handleApplyTemplate(template)}
												size='sm'
											>
												Apply Template
											</Button>
										</CardFooter>
									</Card>
								))}
							</div>
						</ScrollArea>
					)}

					{selectedTemplate && (
						<Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
							<DialogContent className='sm:max-w-[600px]'>
								<DialogHeader>
									<DialogTitle>
										Apply {selectedTemplate.name} Template
									</DialogTitle>
									<DialogDescription>
										Customize the template variables before applying them to
										your stack.
									</DialogDescription>
								</DialogHeader>
								<div className='space-y-4 my-4 max-h-[50vh] overflow-y-auto pr-2'>
									{selectedTemplate.variables.map((variable) => (
										<div key={variable.key} className='space-y-2'>
											<div className='flex justify-between items-center'>
												<Label
													htmlFor={variable.key}
													className='font-mono text-sm'
												>
													{variable.key}
													{variable.required && (
														<span className='text-destructive ml-1'>*</span>
													)}
												</Label>
												<div className='flex space-x-1'>
													{variable.isSecret && (
														<Badge variant='outline' className='text-xs'>
															Secret
														</Badge>
													)}
													<Badge variant='secondary' className='text-xs'>
														{variable.variableType === VariableType.Both
															? 'Build & Runtime'
															: variable.variableType === VariableType.BuildTime
																? 'Build Time'
																: 'Runtime'}
													</Badge>
												</div>
											</div>

											{variable.description && (
												<p className='text-xs text-muted-foreground'>
													{variable.description}
												</p>
											)}

											{variable.validationPattern && (
												<p className='text-xs text-muted-foreground flex items-center'>
													<Info className='h-3 w-3 mr-1' />
													{variable.validationMessage ||
														`Must match pattern: ${variable.validationPattern}`}
												</p>
											)}

											<Textarea
												id={variable.key}
												value={customValues[variable.key] || ''}
												onChange={(e) =>
													handleVariableValueChange(e, variable.key)
												}
												placeholder={variable.defaultValue}
												className='font-mono text-sm'
												rows={
													variable.defaultValue.split('\n').length > 1 ? 3 : 1
												}
											/>
										</div>
									))}
								</div>
								<DialogFooter>
									<Button
										variant='outline'
										onClick={() => setApplyDialogOpen(false)}
									>
										Cancel
									</Button>
									<Button onClick={handleConfirmApply} disabled={isLoading}>
										{isLoading ? (
											<>
												<RefreshCw className='h-4 w-4 mr-2 animate-spin' />
												Applying...
											</>
										) : (
											<>
												<Check className='h-4 w-4 mr-2' />
												Apply Template
											</>
										)}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}
				</div>
			</CardContent>
		</Card>
	)
}

// Mock data for templates
const mockTemplates: VariableTemplate[] = [
	{
		id: 't1',
		name: 'Node.js Web Application',
		description: 'Common environment variables for Node.js web applications',
		variables: [
			{
				key: 'NODE_ENV',
				defaultValue: 'production',
				isSecret: false,
				variableType: VariableType.Both,
				description: 'The environment the application is running in',
				required: true,
				validationPattern: '^(development|test|production)$',
				validationMessage:
					'NODE_ENV must be one of: development, test, production',
			},
			{
				key: 'PORT',
				defaultValue: '3000',
				isSecret: false,
				variableType: VariableType.Runtime,
				description: 'The port the application will listen on',
				required: true,
				validationPattern: '^\\d+$',
				validationMessage: 'PORT must be a valid number',
			},
			{
				key: 'DATABASE_URL',
				defaultValue: 'postgres://username:password@localhost:5432/mydatabase',
				isSecret: true,
				variableType: VariableType.Both,
				description: 'Connection string for your database',
				required: true,
			},
			{
				key: 'JWT_SECRET',
				defaultValue: '',
				isSecret: true,
				variableType: VariableType.Both,
				description: 'Secret key used to sign JWTs',
				required: true,
				validationPattern: '.{16,}',
				validationMessage: 'JWT_SECRET should be at least 16 characters long',
			},
			{
				key: 'CORS_ORIGIN',
				defaultValue: '*',
				isSecret: false,
				variableType: VariableType.Runtime,
				description: 'Allowed CORS origins',
				required: false,
			},
		],
		groups: [
			{
				id: 'g1',
				name: 'Core Settings',
				description: 'Essential application settings',
				inheritFromParent: true,
			},
			{
				id: 'g2',
				name: 'Security',
				description: 'Security-related variables',
				inheritFromParent: false,
			},
		],
		createdAt: '2025-01-01T12:00:00Z',
		modifiedAt: '2025-01-01T12:00:00Z',
		usageCount: 128,
	},
	{
		id: 't2',
		name: 'React Frontend',
		description: 'Environment variables for React applications',
		variables: [
			{
				key: 'REACT_APP_API_URL',
				defaultValue: 'https://api.example.com',
				isSecret: false,
				variableType: VariableType.BuildTime,
				description: 'URL for the backend API',
				required: true,
			},
			{
				key: 'REACT_APP_GOOGLE_ANALYTICS_ID',
				defaultValue: '',
				isSecret: false,
				variableType: VariableType.BuildTime,
				description: 'Google Analytics tracking ID',
				required: false,
			},
			{
				key: 'REACT_APP_FEATURE_FLAGS',
				defaultValue: '{"newUI":false,"beta":false}',
				isSecret: false,
				variableType: VariableType.BuildTime,
				description: 'Feature flags as JSON string',
				required: false,
				validationPattern: '^\\{.*\\}$',
				validationMessage: 'FEATURE_FLAGS must be a valid JSON object',
			},
		],
		groups: [
			{
				id: 'g1',
				name: 'API Configuration',
				description: 'API connection settings',
				inheritFromParent: true,
			},
			{
				id: 'g2',
				name: 'Features',
				description: 'Feature flags and configurations',
				inheritFromParent: true,
			},
		],
		createdAt: '2025-01-02T12:00:00Z',
		modifiedAt: '2025-02-15T14:30:00Z',
		usageCount: 87,
	},
	{
		id: 't3',
		name: 'PostgreSQL Database',
		description: 'Configuration for PostgreSQL database connections',
		variables: [
			{
				key: 'POSTGRES_HOST',
				defaultValue: 'localhost',
				isSecret: false,
				variableType: VariableType.Both,
				description: 'Database host address',
				required: true,
			},
			{
				key: 'POSTGRES_PORT',
				defaultValue: '5432',
				isSecret: false,
				variableType: VariableType.Both,
				description: 'Database port',
				required: true,
				validationPattern: '^\\d+$',
				validationMessage: 'PORT must be a valid number',
			},
			{
				key: 'POSTGRES_DB',
				defaultValue: 'mydatabase',
				isSecret: false,
				variableType: VariableType.Both,
				description: 'Database name',
				required: true,
			},
			{
				key: 'POSTGRES_USER',
				defaultValue: 'postgres',
				isSecret: false,
				variableType: VariableType.Both,
				description: 'Database user',
				required: true,
			},
			{
				key: 'POSTGRES_PASSWORD',
				defaultValue: '',
				isSecret: true,
				variableType: VariableType.Both,
				description: 'Database password',
				required: true,
			},
			{
				key: 'POSTGRES_SSL_MODE',
				defaultValue: 'disable',
				isSecret: false,
				variableType: VariableType.Runtime,
				description: 'SSL mode for database connection',
				required: false,
				validationPattern: '^(disable|require|verify-ca|verify-full)$',
				validationMessage:
					'SSL_MODE must be one of: disable, require, verify-ca, verify-full',
			},
		],
		groups: [
			{
				id: 'g1',
				name: 'Database Connection',
				description: 'Basic connection details',
				inheritFromParent: false,
			},
			{
				id: 'g2',
				name: 'Security Settings',
				description: 'Database security configuration',
				inheritFromParent: false,
			},
		],
		createdAt: '2025-01-15T09:20:00Z',
		modifiedAt: '2025-02-28T16:45:00Z',
		usageCount: 65,
	},
	{
		id: 't4',
		name: 'AWS S3 Configuration',
		description: 'Environment variables for AWS S3 integration',
		variables: [
			{
				key: 'AWS_REGION',
				defaultValue: 'us-east-1',
				isSecret: false,
				variableType: VariableType.Both,
				description: 'AWS region for services',
				required: true,
			},
			{
				key: 'AWS_ACCESS_KEY_ID',
				defaultValue: '',
				isSecret: true,
				variableType: VariableType.Both,
				description: 'AWS access key ID',
				required: true,
			},
			{
				key: 'AWS_SECRET_ACCESS_KEY',
				defaultValue: '',
				isSecret: true,
				variableType: VariableType.Both,
				description: 'AWS secret access key',
				required: true,
			},
			{
				key: 'S3_BUCKET_NAME',
				defaultValue: 'my-app-bucket',
				isSecret: false,
				variableType: VariableType.Both,
				description: 'S3 bucket name for file storage',
				required: true,
			},
			{
				key: 'S3_URL_EXPIRATION',
				defaultValue: '3600',
				isSecret: false,
				variableType: VariableType.Runtime,
				description: 'Expiration time in seconds for S3 signed URLs',
				required: false,
				validationPattern: '^\\d+$',
				validationMessage: 'Expiration time must be a valid number',
			},
		],
		groups: [
			{
				id: 'g1',
				name: 'AWS Credentials',
				description: 'AWS authentication details',
				inheritFromParent: false,
			},
			{
				id: 'g2',
				name: 'S3 Configuration',
				description: 'S3-specific settings',
				inheritFromParent: true,
			},
		],
		createdAt: '2025-02-10T11:15:00Z',
		modifiedAt: '2025-03-05T14:20:00Z',
		usageCount: 42,
	},
]
