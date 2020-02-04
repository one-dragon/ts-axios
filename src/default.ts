

import { AxiosRequestConfig } from "./types"

// 默认配置定义
const defaults: AxiosRequestConfig = {
    method: 'get',

    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },

    timeout: 0,
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