

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

    // 允许你在将请求数据发送到服务器之前对其进行修改，这只适用于请求方法 put、post 和 patch，
    // 如果值是数组，则数组中的最后一个函数必须返回一个字符串或 FormData、URLSearchParams、Blob 等类型作为 xhr.send 方法的参数，
    // 而且在 transform 过程中可以修改 headers 对象。
    // 把之前对请求数据的处理逻辑，放到了默认配置中，也就是默认处理逻辑。
    transformRequest: [
        function(data: any, headers: any): any {
            processHeaders(headers, data)
            return transformRequest(data)
        }
    ],
    // 允许你在把响应数据传递给 then 或者 catch 之前对它们进行修改。
    // 当值为数组的时候，数组的每一个函数都是一个转换函数，数组中的函数就像管道一样依次执行，前者的输出作为后者的输入。
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