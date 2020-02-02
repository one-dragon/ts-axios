
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders } from '../helpers/headers'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
    // TODO
    processConfig(config)
    return xhr(config).then(res => {
        return transformResponseData(res)
    })
}

// 处理配置 config
function processConfig(config: AxiosRequestConfig): void {
    config.url = transformURL(config)
    config.headers = transformHeaders(config) // 先处理 headers，再处理 data
    config.data = transformRequestData(config)
}

// 处理请求 url 参数
function transformURL(config: AxiosRequestConfig): string {
    const { url, params } = config
    return buildURL(url!, params)
}

// 处理请求 data
function transformRequestData(config: AxiosRequestConfig): any {
    return transformRequest(config.data)
}

// 处理请求 headers
function transformHeaders(config: AxiosRequestConfig): any {
    const { headers = {}, data } = config
    return processHeaders(headers, data)
}

// 处理响应 data
function transformResponseData(res: AxiosResponse): AxiosResponse {
    res.data = transformResponse(res.data)
    return res
}
