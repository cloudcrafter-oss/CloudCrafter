import { useGetServersHook } from '@cloudcrafter/api'
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
import type { FieldPath, UseFormReturn } from 'react-hook-form'

interface ServerSelectProps<T extends { serverId: string }> {
	form: UseFormReturn<T>
	inputDisabled: boolean
}

export const ServerSelect = <T extends { serverId: string }>({
	form,
	inputDisabled,
}: ServerSelectProps<T>) => {
	const { data: servers } = useGetServersHook()

	return (
		<FormField
			control={form.control}
			name={'serverId' as FieldPath<T>}
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
