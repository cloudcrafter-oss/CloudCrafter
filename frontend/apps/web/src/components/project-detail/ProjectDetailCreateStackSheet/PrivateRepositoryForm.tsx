import {
	type SourceProviderDto,
	type createStackCommandCommandSchema,
	useGetProvidersHook,
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
import { cn } from '@cloudcrafter/ui/lib/utils'
import { GithubIcon, GitlabIcon, Loader2 } from 'lucide-react'
import { useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type * as z from 'zod'
import { ServerSelect } from './ServerSelect'

interface PrivateRepositoryFormProps {
	form: UseFormReturn<z.infer<typeof createStackCommandCommandSchema>>
	onSubmit: (
		values: z.infer<typeof createStackCommandCommandSchema>,
	) => Promise<void>
	onBack: () => void
	inputDisabled: boolean
}

const ProviderButton = ({
	provider,
	onClick,
	disabled,
}: { provider: SourceProviderDto; onClick: () => void; disabled: boolean }) => {
	const iconMap = {
		github: <GithubIcon />,
		gitlab: <GitlabIcon />,
	}
	return (
		<Button
			type='button'
			variant='outline'
			className={cn(
				'flex-1',
				provider.name.toLowerCase() === 'github' &&
					'hover:bg-[#2da44e]/10 hover:border-[#2da44e]',
				provider.name.toLowerCase() === 'gitlab' &&
					'hover:bg-[#E24329]/10 hover:border-[#E24329]',
			)}
			onClick={onClick}
			disabled={disabled}
		>
			{iconMap[provider.type.toLowerCase() as keyof typeof iconMap]}
			{provider.name}
		</Button>
	)
}

export const PrivateRepositoryForm = ({
	form,
	onSubmit,
	onBack,
	inputDisabled,
}: PrivateRepositoryFormProps) => {
	const { data: providers, isLoading: isLoadingProviders } =
		useGetProvidersHook()
	const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

	if (!selectedProvider) {
		return (
			<div className='space-y-4'>
				<div className='space-y-2'>
					<h2 className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
						Select Provider
					</h2>
					<div className='flex gap-2'>
						{isLoadingProviders ? (
							<div className='w-full flex justify-center'>
								<Loader2 className='h-4 w-4 animate-spin' />
							</div>
						) : (
							providers?.map((provider) => (
								<ProviderButton
									key={provider.id}
									provider={provider}
									onClick={() => setSelectedProvider(provider.id)}
									disabled={inputDisabled}
								/>
							))
						)}
					</div>
				</div>
				<div className='flex justify-between'>
					<Button type='button' variant='outline' onClick={onBack}>
						Back
					</Button>
				</div>
			</div>
		)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem className='space-y-2'>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input disabled={inputDisabled} {...field} autoComplete='off' />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Add GitHub integration setup here */}
				<div className='p-4 border rounded-md'>
					<p className='text-sm text-muted-foreground'>
						To use private repositories, you need to set up GitHub integration
						first.
					</p>
					<Button className='mt-2' variant='outline'>
						Configure GitHub Integration
					</Button>
				</div>

				<ServerSelect form={form} inputDisabled={inputDisabled} />

				<div className='flex justify-between'>
					<Button
						type='button'
						variant='outline'
						onClick={() => {
							setSelectedProvider(null)
							onBack()
						}}
					>
						Back
					</Button>
					<Button type='submit' disabled={inputDisabled}>
						{inputDisabled && <Loader2 className='h-4 w-4 animate-spin mr-2' />}
						Add Stack
					</Button>
				</div>
			</form>
		</Form>
	)
}
