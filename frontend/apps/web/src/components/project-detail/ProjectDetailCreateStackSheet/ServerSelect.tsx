import { useGetServersHook } from '@cloudcrafter/api'
import type { createStackCommandCommandSchema } from '@cloudcrafter/api'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@cloudcrafter/ui/components/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@cloudcrafter/ui/components/select'
import type { UseFormReturn } from 'react-hook-form'
import type * as z from 'zod'

interface ServerSelectProps {
	form: UseFormReturn<z.infer<typeof createStackCommandCommandSchema>>
	inputDisabled: boolean
}

export const ServerSelect = ({ form, inputDisabled }: ServerSelectProps) => {
	const { data: servers } = useGetServersHook()

	return (
		<FormField
			control={form.control}
			name='serverId'
			render={({ field }) => (
				<FormItem className='space-y-2'>
					<FormLabel>Server</FormLabel>
					<FormControl>
						<Select
							disabled={inputDisabled}
							onValueChange={field.onChange}
							value={field.value}
						>
							<SelectTrigger>
								{field.value
									? servers?.find((server) => server.id === field.value)?.name
									: 'Select a server'}
							</SelectTrigger>
							<SelectContent>
								{servers?.map((server) => (
									<SelectItem key={server.id} value={server.id}>
										{server.name} ({server.ipAddress})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
