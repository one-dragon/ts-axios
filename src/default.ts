

import { AxiosRequestConfig } from "./types"
import { processHeaders } from './helpers/headers'
import { transformRequest, transformResponse } from './helpers/data'

// 默认配置定义
const defaults: AxiosRequestConfig = {
    method: 'get',

    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },

    timeout: 0,

    // 把之前对请求数据的处理逻辑，放到了默认配置中，也就是默认处理逻辑。
    transformRequest: [
        function(data: any, headers: any): any {
            processHeaders(headers, data)
            return transformRequest(data)
        }
    ],
    // 把之前对响应数据的处理逻辑，放到了默认配置中，也就是默认处理逻辑。
    transformResponse: [
        function (data: any): any {
            return transformResponse(data)
        }
    ]
}

// 没 data 的请求默认配置
const methodsNoData = ['get', 'delete', 'head', 'options']
methodsNoData.forEach(method => {
    defaults.headers[method] = {}
})

// 有 data 的请求默认配置
const methodsWithData = ['post', 'put', 'patch']
methodsWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults