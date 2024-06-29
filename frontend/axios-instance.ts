import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';

// https://orval.dev/reference/configuration/output#mutator

const customOptions: AxiosRequestConfig = {
    paramsSerializer: {
        // Override the params serialization so that complex object arrays in query strings are properly
        // received by the backend.
        serialize: params => qs.stringify(params, { allowDots: true }),
    },
};

// add a second `options` argument here if you want to pass extra options to each generated query
export const axiosInstance = async <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const result = await axios({
        ...config,
        ...customOptions,
        ...options,
    });

    return result.data;
};