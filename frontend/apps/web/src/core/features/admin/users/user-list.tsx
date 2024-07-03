import { getUsers } from '@/src/core/generated'

export const UsersList = async () => {
    const users = await getUsers()
    return <><h1>Users List</h1>
        <pre>{JSON.stringify({ users }, null, 2)}</pre>

    </>
} 