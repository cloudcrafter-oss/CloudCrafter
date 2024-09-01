import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { getSession } from 'next-auth/react'

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
    url?: string
    method: 'get' | 'put' | 'patch' | 'post' | 'delete'
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
    baseURL: 'http://web.127.0.0.1.sslip.io/'
})

axiosInstance.interceptors.request.use(async (request) => {
    const session = await getSession()

    if (session) {
        request.headers.Authorization = `Bearer ${session.accessToken}`
    }

    return request
})

export const axiosClient = async <
    TData,
    TError = unknown,
    TVariables = unknown,
>(
    config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
    const promise = axiosInstance
        .request<TVariables, ResponseConfig<TData>>({ ...config })
        .catch((e: AxiosError<TError>) => {
            throw e
        })

    return promise
}

export default axiosClient
