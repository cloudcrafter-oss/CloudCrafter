import { AdminLayout } from '../src/features/admin/admin-layout.tsx'

export default function NextAdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>
}