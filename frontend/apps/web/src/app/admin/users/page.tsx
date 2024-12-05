import {
	type UserListProps,
	UsersList,
} from '@/src/core/features/admin/users/user-list'

export default function Page({ searchParams }: UserListProps) {
	return <UsersList searchParams={searchParams} />
}
