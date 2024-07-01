import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/auth.ts'
import { Session } from 'next-auth'

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<Session | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            const session = await auth()
            if (!session) {
                router.replace('/auth/signin')
            } else {
                setSession(session)
            }
            setLoading(false)
        }

        checkAuth()
    }, [router])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!session) {
        return <div>Not authenticated</div>
    }

    return children
}

export default AuthWrapper