import client from '@kubb/swagger-client/client'
import {
	infiniteQueryOptions,
	queryOptions,
	useInfiniteQuery,
	useQuery,
	useSuspenseQuery,
} from '@tanstack/react-query'
import type {
	InfiniteData,
	InfiniteQueryObserverOptions,
	QueryKey,
	QueryObserverOptions,
	UseInfiniteQueryResult,
	UseQueryResult,
	UseSuspenseQueryOptions,
	UseSuspenseQueryResult,
} from '@tanstack/react-query'
import type {
	GetProjectEnvironmentEnhanced404,
	GetProjectEnvironmentEnhancedPathParams,
	GetProjectEnvironmentEnhancedQueryResponse,
} from '../types/GetProjectEnvironmentEnhanced'

type GetProjectEnvironmentEnhancedClient = typeof client<
	GetProjectEnvironmentEnhancedQueryResponse,
	GetProjectEnvironmentEnhanced404,
	never
>
type GetProjectEnvironmentEnhanced = {
	data: GetProjectEnvironmentEnhancedQueryResponse
	error: GetProjectEnvironmentEnhanced404
	request: never
	pathParams: GetProjectEnvironmentEnhancedPathParams
	queryParams: never
	headerParams: never
	response: GetProjectEnvironmentEnhancedQueryResponse
	client: {
		parameters: Partial<Parameters<GetProjectEnvironmentEnhancedClient>[0]>
		return: Awaited<ReturnType<GetProjectEnvironmentEnhancedClient>>
	}
}
export const getProjectEnvironmentEnhancedQueryKey = (
	id: GetProjectEnvironmentEnhancedPathParams['id'],
	environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
) =>
	[
		{
			url: '/api/Projects/:id/:environmentId',
			params: { id: id, environmentId: environmentId },
		},
	] as const
export type GetProjectEnvironmentEnhancedQueryKey = ReturnType<
	typeof getProjectEnvironmentEnhancedQueryKey
>
export function getProjectEnvironmentEnhancedQueryOptions(
	id: GetProjectEnvironmentEnhancedPathParams['id'],
	environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
	options: GetProjectEnvironmentEnhanced['client']['parameters'] = {},
) {
	const queryKey = getProjectEnvironmentEnhancedQueryKey(id, environmentId)
	return queryOptions({
		queryKey,
		queryFn: async () => {
			const res = await client<
				GetProjectEnvironmentEnhanced['data'],
				GetProjectEnvironmentEnhanced['error']
			>({
				method: 'get',
				url: `/api/Projects/${id}/${environmentId}`,
				...options,
			})
			return res.data
		},
	})
}
/**
 * @link /api/Projects/:id/:environmentId
 */
export function useGetProjectEnvironmentEnhancedHook<
	TData = GetProjectEnvironmentEnhanced['response'],
	TQueryData = GetProjectEnvironmentEnhanced['response'],
	TQueryKey extends QueryKey = GetProjectEnvironmentEnhancedQueryKey,
>(
	id: GetProjectEnvironmentEnhancedPathParams['id'],
	environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
	options: {
		query?: Partial<
			QueryObserverOptions<
				GetProjectEnvironmentEnhanced['response'],
				GetProjectEnvironmentEnhanced['error'],
				TData,
				TQueryData,
				TQueryKey
			>
		>
		client?: GetProjectEnvironmentEnhanced['client']['parameters']
	} = {},
): UseQueryResult<TData, GetProjectEnvironmentEnhanced['error']> & {
	queryKey: TQueryKey
} {
	const { query: queryOptions, client: clientOptions = {} } = options ?? {}
	const queryKey =
		queryOptions?.queryKey ??
		getProjectEnvironmentEnhancedQueryKey(id, environmentId)
	const query = useQuery({
		...(getProjectEnvironmentEnhancedQueryOptions(
			id,
			environmentId,
			clientOptions,
		) as unknown as QueryObserverOptions),
		queryKey,
		...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
	}) as UseQueryResult<TData, GetProjectEnvironmentEnhanced['error']> & {
		queryKey: TQueryKey
	}
	query.queryKey = queryKey as TQueryKey
	return query
}
export const getProjectEnvironmentEnhancedInfiniteQueryKey = (
	id: GetProjectEnvironmentEnhancedPathParams['id'],
	environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
) =>
	[
		{
			url: '/api/Projects/:id/:environmentId',
			params: { id: id, environmentId: environmentId },
		},
	] as const
export type GetProjectEnvironmentEnhancedInfiniteQueryKey = ReturnType<
	typeof getProjectEnvironmentEnhancedInfiniteQueryKey
>
export function getProjectEnvironmentEnhancedInfiniteQueryOptions(
	id: GetProjectEnvironmentEnhancedPathParams['id'],
	environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
	options: GetProjectEnvironmentEnhanced['client']['parameters'] = {},
) {
	const queryKey = getProjectEnvironmentEnhancedInfiniteQueryKey(
		id,
		environmentId,
	)
	return infiniteQueryOptions({
		queryKey,
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore pageParam is declared but its value is possibly never read
		queryFn: async ({ pageParam }) => {
			const res = await client<
				GetProjectEnvironmentEnhanced['data'],
				GetProjectEnvironmentEnhanced['error']
			>({
				method: 'get',
				url: `/api/Projects/${id}/${environmentId}`,
				...options,
			})
			return res.data
		},
		initialPageParam: 0,
		getNextPageParam: (lastPage, _allPages, lastPageParam) =>
			Array.isArray(lastPage) && lastPage.length === 0
				? undefined
				: lastPageParam + 1,
		getPreviousPageParam: (_firstPage, _allPages, firstPageParam) =>
			firstPageParam <= 1 ? undefined : firstPageParam - 1,
	})
}
/**
 * @link /api/Projects/:id/:environmentId
 */
export function useGetProjectEnvironmentEnhancedHookInfinite<
	TData = InfiniteData<GetProjectEnvironmentEnhanced['response']>,
	TQueryData = GetProjectEnvironmentEnhanced['response'],
	TQueryKey extends QueryKey = GetProjectEnvironmentEnhancedInfiniteQueryKey,
>(
	id: GetProjectEnvironmentEnhancedPathParams['id'],
	environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
	options: {
		query?: Partial<
			InfiniteQueryObserverOptions<
				GetProjectEnvironmentEnhanced['response'],
				GetProjectEnvironmentEnhanced['error'],
				TData,
				TQueryData,
				TQueryKey
			>
		>
		client?: GetProjectEnvironmentEnhanced['client']['parameters']
	} = {},
): UseInfiniteQueryResult<TData, GetProjectEnvironmentEnhanced['error']> & {
	queryKey: TQueryKey
} {
	const { query: queryOptions, client: clientOptions = {} } = options ?? {}
	const queryKey =
		queryOptions?.queryKey ??
		getProjectEnvironmentEnhancedInfiniteQueryKey(id, environmentId)
	const query = useInfiniteQuery({
		...(getProjectEnvironmentEnhancedInfiniteQueryOptions(
			id,
			environmentId,
			clientOptions,
		) as unknown as InfiniteQueryObserverOptions),
		queryKey,
		...(queryOptions as unknown as Omit<
			InfiniteQueryObserverOptions,
			'queryKey'
		>),
	}) as UseInfiniteQueryResult<
		TData,
		GetProjectEnvironmentEnhanced['error']
	> & {
		queryKey: TQueryKey
	}
	query.queryKey = queryKey as TQueryKey
	return query
}
export const getProjectEnvironmentEnhancedSuspenseQueryKey = (
	id: GetProjectEnvironmentEnhancedPathParams['id'],
	environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
) =>
	[
		{
			url: '/api/Projects/:id/:environmentId',
			params: { id: id, environmentId: environmentId },
		},
	] as const
export type GetProjectEnvironmentEnhancedSuspenseQueryKey = ReturnType<
	typeof getProjectEnvironmentEnhancedSuspenseQueryKey
>
export function getProjectEnvironmentEnhancedSuspenseQueryOptions(
	id: GetProjectEnvironmentEnhancedPathParams['id'],
	environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
	options: GetProjectEnvironmentEnhanced['client']['parameters'] = {},
) {
	const queryKey = getProjectEnvironmentEnhancedSuspenseQueryKey(
		id,
		environmentId,
	)
	return queryOptions({
		queryKey,
		queryFn: async () => {
			const res = await client<
				GetProjectEnvironmentEnhanced['data'],
				GetProjectEnvironmentEnhanced['error']
			>({
				method: 'get',
				url: `/api/Projects/${id}/${environmentId}`,
				...options,
			})
			return res.data
		},
	})
}
/**
 * @link /api/Projects/:id/:environmentId
 */
export function useGetProjectEnvironmentEnhancedHookSuspense<
	TData = GetProjectEnvironmentEnhanced['response'],
	TQueryKey extends QueryKey = GetProjectEnvironmentEnhancedSuspenseQueryKey,
>(
	id: GetProjectEnvironmentEnhancedPathParams['id'],
	environmentId: GetProjectEnvironmentEnhancedPathParams['environmentId'],
	options: {
		query?: Partial<
			UseSuspenseQueryOptions<
				GetProjectEnvironmentEnhanced['response'],
				GetProjectEnvironmentEnhanced['error'],
				TData,
				TQueryKey
			>
		>
		client?: GetProjectEnvironmentEnhanced['client']['parameters']
	} = {},
): UseSuspenseQueryResult<TData, GetProjectEnvironmentEnhanced['error']> & {
	queryKey: TQueryKey
} {
	const { query: queryOptions, client: clientOptions = {} } = options ?? {}
	const queryKey =
		queryOptions?.queryKey ??
		getProjectEnvironmentEnhancedSuspenseQueryKey(id, environmentId)
	const query = useSuspenseQuery({
		...(getProjectEnvironmentEnhancedSuspenseQueryOptions(
			id,
			environmentId,
			clientOptions,
		) as unknown as QueryObserverOptions),
		queryKey,
		...(queryOptions as unknown as Omit<QueryObserverOptions, 'queryKey'>),
	}) as UseSuspenseQueryResult<
		TData,
		GetProjectEnvironmentEnhanced['error']
	> & {
		queryKey: TQueryKey
	}
	query.queryKey = queryKey as TQueryKey
	return query
}
