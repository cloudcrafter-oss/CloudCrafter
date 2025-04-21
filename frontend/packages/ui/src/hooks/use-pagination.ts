import type { PaginationState } from '@tanstack/react-table'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

interface UsePaginationOptions {
	pageSize?: number
	pageParamName?: string
	pageSizeParamName?: string
}

interface UsePaginationResult {
	page: number
	pageSize: number
	setPage: (page: number) => void
	setPageSize: (pageSize: number) => void
	setFilters: (pagination: PaginationState) => void
}

export function usePagination({
	pageSize: defaultPageSize = 10,
	pageParamName = 'page',
	pageSizeParamName = 'pageSize',
}: UsePaginationOptions = {}): UsePaginationResult {
	const router = useRouter()
	const searchParams = useSearchParams()

	const page = useMemo(() => {
		const pageParam = searchParams.get(pageParamName)
		return pageParam ? Math.max(1, Number.parseInt(pageParam, 10)) : 1
	}, [searchParams, pageParamName])

	const pageSize = useMemo(() => {
		const pageSizeParam = searchParams.get(pageSizeParamName)
		return pageSizeParam
			? Math.max(1, Number.parseInt(pageSizeParam, 10))
			: defaultPageSize
	}, [searchParams, pageSizeParamName, defaultPageSize])

	const setPage = useCallback(
		(newPage: number) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set(pageParamName, Math.max(1, newPage).toString())
			router.push(`?${params.toString()}`)
		},
		[router, searchParams, pageParamName],
	)

	const setPageSize = useCallback(
		(newPageSize: number) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set(pageSizeParamName, Math.max(1, newPageSize).toString())
			params.set(pageParamName, '1') // Reset to first page when changing page size
			router.push(`?${params.toString()}`)
		},
		[router, searchParams, pageParamName, pageSizeParamName],
	)

	const setFilters = (pagination: PaginationState) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set(pageParamName, (pagination.pageIndex + 1).toString())
		params.set(pageSizeParamName, pagination.pageSize.toString())
		router.push(`?${params.toString()}`)
	}

	return {
		page,
		pageSize,
		setPage,
		setPageSize,
		setFilters,
	}
}
