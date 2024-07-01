import { auth } from '@/auth.ts'

export default async function Page() {
    const session = await auth()


    return (
        <div>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    )
}