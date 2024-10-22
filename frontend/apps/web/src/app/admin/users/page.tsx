import {
	type UserListProps,
	UsersList,
} from '@/src/core/features/admin/users/user-list.tsx'

export default async function Page(props: UserListProps) {
	const searchParams = await props.searchParams
	return <UsersList searchParams={searchParams} />
}
