'use client'
import { Suspense } from 'react'
import { UsersTable } from './users-table'

export default function UsersPage() {
	return (
		<div className='container mx-auto py-10'>
			<Suspense fallback={<div>Loading...</div>}>
				<UsersTable />
			</Suspense>
		</div>
	)
}
