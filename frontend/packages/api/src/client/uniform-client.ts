import axios from 'axios'

import type {
	AxiosError,
	AxiosHeaders,
	AxiosRequestConfig,
	AxiosResponse,
} from 'axios'
import { getSession, signOut } from 'next-auth/react'
import { auth } from '../authjs/auth'
import { clientsEnvironment } from './uniform-environment'

declare const AXIOS_BASE: string
declare const AXIOS_HEADERS: string

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
	baseURL?: string
	url?: string
	method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'OPTIONS'
	params?: unknown
	data?: TData | FormData
	responseType?:
		| 'arraybuffer'
		| 'blob'
		| 'document'
		| 'json'
		| 'text'
		| 'stream'
	signal?: AbortSignal
	headers?: AxiosRequestConfig['headers']
}

/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
	data: TData
	status: number
	statusText: string
	headers: AxiosResponse['headers']
}

export type ResponseErrorConfig<TError = unknown> = AxiosError<TError>

let _config: Partial<RequestConfig> = {
	baseURL: typeof AXIOS_BASE !== 'undefined' ? AXIOS_BASE : undefined,
	headers:
		typeof AXIOS_HEADERS !== 'undefined'
			? (JSON.parse(AXIOS_HEADERS) as AxiosHeaders)
			: undefined,
}

export const getConfig = () => _config

export const setConfig = (config: RequestConfig) => {
	_config = config
	return getConfig()
}

export const axiosInstance = axios.create({
	baseURL: clientsEnvironment.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL,
})

axiosInstance.interceptors.request.use(async (request) => {
	const isServer = typeof window === 'undefined'
	let session = null

	if (isServer) {
		// Fetch session on the server side
		session = await auth()
	} else {
		// Fetch session on the client side
		session = await getSession()
	}

	if (session) {
		request.headers.Authorization = `Bearer ${session.tokens.access}`
	}

	return request
})

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		if (error.response?.status === 401 && typeof window !== 'undefined') {
			// Only handle 401s on client side
			await signOut({ redirect: true, callbackUrl: '/auth/login' })
			return
		}
		throw error
	},
)

export const client = async <TData, TError = unknown, TVariables = unknown>(
	config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
	const globalConfig = getConfig()

	return axiosInstance
		.request<TData, ResponseConfig<TData>>({
			...globalConfig,
			...config,
			headers: {
				...globalConfig.headers,
				...config.headers,
			},
		})
		.catch((e: AxiosError<TError>) => {
			throw e
		})
}

client.getConfig = getConfig
client.setConfig = setConfig

export default client
