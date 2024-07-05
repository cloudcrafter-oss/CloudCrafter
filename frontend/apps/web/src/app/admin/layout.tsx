import { AdminLayout } from '../src/features/admin/admin-layout.tsx'
import { TooltipProvider } from '@ui/components/ui/tooltip.tsx'

export default function NextAdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayout><TooltipProvider>{children}</TooltipProvider></AdminLayout>
}