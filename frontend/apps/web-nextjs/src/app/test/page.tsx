import { auth } from '../../auth.ts'


export default async function Page() {
    const user = await auth()
    return (
        <pre>{JSON.stringify({ user }, null, 2)}</pre>

    )
}
