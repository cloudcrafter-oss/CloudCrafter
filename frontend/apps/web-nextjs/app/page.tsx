'use client'
import { Button } from '@ui/components'

export default function Page() {
    const goToLogin = () => {
        console.log('Go to login')
        window.location.href = '/api/auth/login'
    }
    return (
        <main>
            <Button onClick={goToLogin}>Click me</Button>

        </main>
    )
}
