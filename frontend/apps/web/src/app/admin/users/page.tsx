'use client'
import { UsersTable } from './users-table'

export default function UsersPage() {
	return (
		<div className='container mx-auto py-10'>
			<h1 className='text-2xl font-bold mb-6'>Users</h1>
			<UsersTable />
		</div>
	)
}
