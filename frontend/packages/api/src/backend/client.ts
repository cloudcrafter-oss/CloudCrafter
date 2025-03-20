import { auth } from '@/src/auth'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { backendEnv } from '../env/cloudcrafter-env'

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
	url?: string
	method: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE'
	params?: unknown
	data?: TData
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
	headers?: AxiosResponse['headers']
}

export const axiosInstance = axios.create({
	baseURL: backendEnv.CLOUDCRAFTER_AXIOS_BACKEND_BASEURL,
})

axiosInstance.interceptors.request.use(async (request) => {
	const session = await auth()

	if (session) {
		request.headers.Authorization = `Bearer ${session.accessToken}`
	}

	return request
})

export type ResponseErrorConfig<TError = unknown> = TError

// export const axiosClient = async <
// 	TData,
// 	TError = unknown,
// 	TVariables = unknown,
// >(
// 	config: RequestConfig<TVariables>,
// ): Promise<ResponseConfig<TData>> => {
// 	const promise = axiosInstance
// 		.request<TVariables, ResponseConfig<TData>>({ ...config })
// 		.catch((e: AxiosError<TError>) => {
// 			throw e
// 		})

// 	return promise
// }

export const client = async <TData, TError = unknown, TVariables = unknown>(
	config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
	const promise = axiosInstance
		.request<TVariables, ResponseConfig<TData>>({ ...config })
		.catch((e: AxiosError<TError>) => {
			throw e
		})

	return promise
}

export default client
