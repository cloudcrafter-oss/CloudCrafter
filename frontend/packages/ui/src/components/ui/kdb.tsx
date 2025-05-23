import { cn } from '@cloudcrafter/ui/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'
import type * as React from 'react'

const kbdVariants = cva(
	'select-none rounded border px-1.5 py-px font-mono text-[0.7rem] font-normal shadow-sm disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-accent text-accent-foreground',
				outline: 'bg-background text-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

export interface KbdProps
	extends React.ComponentPropsWithoutRef<'kbd'>,
		VariantProps<typeof kbdVariants> {
	/**
	 * The title of the `abbr` element inside the `kbd` element.
	 * @default undefined
	 * @type string | undefined
	 * @example title="Command"
	 */
	abbrTitle?: string
}

const Kbd = ({
	ref,
	abbrTitle,
	children,
	className,
	variant,
	...props
}: KbdProps & {
	ref: React.RefObject<HTMLUnknownElement>
}) => {
	return (
		<kbd
			className={cn(kbdVariants({ variant, className }))}
			ref={ref}
			{...props}
		>
			{abbrTitle ? (
				<abbr title={abbrTitle} className='no-underline'>
					{children}
				</abbr>
			) : (
				children
			)}
		</kbd>
	)
}
Kbd.displayName = 'Kbd'

export { Kbd }
