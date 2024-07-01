import { AdminLayout } from '../../src/features/admin/admin-layout'

export default function NextAdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>
}