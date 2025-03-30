import { useTheme } from '@/src/layout/components/theme-provider'
import { Button } from '@cloudcrafter/ui/components/button'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle = () => {
	const { setTheme, theme } = useTheme()

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			className='h-9 w-9 rounded-md border'
		>
			<Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100' />

			<span className='sr-only'>Toggle theme</span>
		</Button>
	)
}
