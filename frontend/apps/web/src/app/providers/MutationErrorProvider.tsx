import { Http422ErrorSchema } from '@/src/core/backend/zod/http422error'
import {
	type MutationCacheNotifyEvent,
	useQueryClient,
} from '@tanstack/react-query'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@ui/components/ui/alert-dialog'
import { cn } from '@ui/lib/utils'
import { AxiosError } from 'axios'
import { AlertCircle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export const MutationErrorProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const client = useQueryClient()

	const [visibleErrorMessage, setVisibleErrorMessage] = useState<string | null>(
		null,
	)

	const [open, setOpen] = useState(false)

	const [countdown, setCountdown] = useState(5)

	const handleError = useCallback((message: string) => {
		setVisibleErrorMessage(message)
		setOpen(true)
		setCountdown(5)

		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1)
		}, 1000)

		setTimeout(() => {
			clearInterval(timer)
			setOpen(false)
			setCountdown(5)
		}, 5000)
	}, [])

	useEffect(() => {
		const unsubscribe = client
			.getMutationCache()
			.subscribe((event: MutationCacheNotifyEvent) => {
				if (event.type === 'updated') {
					const error = event.mutation.state.error
					// test if error is an instance of AxiosError
					if (error instanceof AxiosError && error.response?.status === 422) {
						// validate against Http422ErrorSchema
						const result = Http422ErrorSchema.safeParse(error.response?.data)
						if (result.success) {
							const firstKey = Object.keys(result.data.errors)[0]
							const firstError = result.data.errors[firstKey][0]
							handleError(firstError)
						}
					}
				}
			})

		return () => {
			unsubscribe()
		}
	}, [client, handleError])

	return (
		<>
			<AlertDialog open={open}>
				<AlertDialogContent className='border-2 border-destructive'>
					<AlertDialogHeader>
						<AlertDialogTitle className='flex items-center gap-2 text-destructive font-semibold'>
							<AlertCircle className='h-5 w-5' />
							Error
						</AlertDialogTitle>
						<AlertDialogDescription
							className={cn(
								'text-foreground font-medium',
								'bg-destructive/5 p-4 rounded-md mt-2',
							)}
						>
							<span className='text-destructive font-semibold'>
								Request cannot be completed
							</span>
							<br />
							<span className='text-muted-foreground'>Reason: </span>
							{visibleErrorMessage}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={() => setOpen(false)}
							className='bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold'
						>
							Close{countdown > 0 ? ` (${countdown})` : ''}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{children}
		</>
	)
}
