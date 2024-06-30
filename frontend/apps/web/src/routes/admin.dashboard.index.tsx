import { createFileRoute } from '@tanstack/react-router'
import { AdminDashboardComponent } from '../app/features/admin/dashboard.tsx'
import { AdminLayout } from '../app/features/admin/layout.tsx'

export const Route = createFileRoute('/admin/dashboard/')({
    component: AdminDashboard,
})

function AdminDashboard() {
    return <AdminLayout>
        <AdminDashboardComponent/>
    </AdminLayout>
}
