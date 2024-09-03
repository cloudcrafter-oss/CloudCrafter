import { cn } from '@ui/lib/utils'
import { Loader2 } from 'lucide-react'

const Spinner = ({ className }: { className?: string }) => {
	return (
		<Loader2
			className={cn('my-28 h-16 w-16 text-primary/60 animate-spin', className)}
		/>
	)
}

export { Spinner }
