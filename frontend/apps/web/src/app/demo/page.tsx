import Dashboard from '@/src/layout/pages/dashboard'
import { ThemeProvider } from '@/src/layout/components/theme-provider.tsx'
import AppShell from '@/src/layout/components/app-shell.tsx'

export default function Page() {
    return (<ThemeProvider defaultTheme={'dark'} storageKey={'theme-ui'}>
        <AppShell> <Dashboard/>
        </AppShell>
    </ThemeProvider>)
    
}