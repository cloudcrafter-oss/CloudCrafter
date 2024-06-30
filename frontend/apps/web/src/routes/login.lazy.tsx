import { createLazyFileRoute } from '@tanstack/react-router'
import { LoginComponent } from '../app/features/login/components/login-component.tsx'

export const Route = createLazyFileRoute('/login')({
    component: Login,
})

function Login() {
    return (
        <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <LoginComponent/>
            </div>
        </div>
    )
}