'use client'

import { Button } from '@cloudcrafter/ui/components/button'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Loader2, Save } from 'lucide-react'
import { useState } from 'react'

type SaveButtonProps = {
	onSave?: () => Promise<void>
	className?: string
}

export function AnimatedSaveButton({ onSave, className }: SaveButtonProps) {
	const [state, setState] = useState<'idle' | 'saving' | 'success'>('idle')

	const handleSave = async () => {
		if (state !== 'idle') return

		setState('saving')
		try {
			if (onSave) {
				await onSave()
			}
			setState('success')

			// Reset to idle after showing success
			setTimeout(() => {
				setState('idle')
			}, 2000)
		} catch (error) {
			setState('idle')
			console.error('Error saving:', error)
		}
	}

	return (
		<Button
			onClick={handleSave}
			className={`relative ${className}`}
			disabled={state !== 'idle'}
			variant={state === 'success' ? 'default' : 'default'}
		>
			<span className='flex items-center gap-2'>
				<AnimatePresence mode='wait'>
					{state === 'idle' && (
						<motion.span
							key='idle'
							className='flex items-center gap-2'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<Save className='size-4' />
							<span>Save changes</span>
						</motion.span>
					)}

					{state === 'saving' && (
						<motion.span
							key='saving'
							className='flex items-center gap-2'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<Loader2 className='size-4 animate-spin' />
							<span>Saving changes...</span>
						</motion.span>
					)}

					{state === 'success' && (
						<motion.span
							key='success'
							className='flex items-center gap-2 text-green-50'
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{
								opacity: 1,
								scale: 1,
								transition: {
									type: 'spring',
									stiffness: 500,
									damping: 15,
								},
							}}
							exit={{ opacity: 0 }}
						>
							<CheckCircle className='size-4' />
							<span>Changes saved</span>
						</motion.span>
					)}
				</AnimatePresence>
			</span>
		</Button>
	)
}
