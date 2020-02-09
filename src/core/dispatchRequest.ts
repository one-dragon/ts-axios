
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, isAbsoluteURL, combineURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    // TODO
    throwIfCancellationRequested(config) // 发送请求前检查 config.cancelToken 是否已经使用过，如果已经被用过则不用发请求，直接抛异常
    processConfig(config)
    return xhr(config).then(res => {
        return transformResponseData(res)
    })
}

// 处理配置 config
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    // config.headers = transformHeaders(config) // 先处理 headers，再处理 data
    // config.data = transformRequestData(config)
    // 在默认配置中 config.defaults.transformRequest 中处理请求的 headers、data
    config.data = transform(config.data, config.headers, config.transformRequest)
    config.headers = flattenHeaders(config.headers, config.method!) // 提取 headers.common 公共字段，提取 headers.get、headers.post 字段(需要和该次请求的方法对应)
}

// 处理请求 url 参数
function transformURL(config: AxiosRequestConfig): string {
    let { url, params, paramsSerializer, baseURL } = config
    if(baseURL && !isAbsoluteURL(url!)) { // 处理 baseURL 拼接
        url = combineURL(baseURL, url)
    }
    return buildURL(url!, params, paramsSerializer)
}

// // 处理请求 data
// function transformRequestData(config: AxiosRequestConfig): any {
//     return transformRequest(config.data)
// }

// // 处理请求 headers
// function transformHeaders(config: AxiosRequestConfig): any {
//     const { headers = {}, data } = config
//     return processHeaders(headers, data)
// }

// 处理响应 data
function transformResponseData(res: AxiosResponse): AxiosResponse {
    // res.data = transformResponse(res.data)
    // 在默认配置中 config.defaults.transformResponse 中处理响应的 data
    res.data = transform(res.data, res.headers, res.config.transformResponse)
    return res
}

// 发送请求前检查 config.cancelToken 是否已经使用过，如果已经被用过则不用发请求，直接抛异常
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
    if(config.cancelToken) {
        config.cancelToken.throwIfRequested()
    }
}