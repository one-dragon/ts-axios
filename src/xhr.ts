
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve) => {
        const { data = null, url, method = 'get', headers, responseType } = config

        const request = new XMLHttpRequest()

        if (responseType) { // 设置响应返回类型： "" | "arraybuffer" | "blob" | "document" | "json" | "text"
            request.responseType = responseType
        }

        request.open(method.toUpperCase(), url, true)

        request.onreadystatechange = function handleLoad() {
            if(request.readyState !== 4) {
                return
            }
            // const responseHeaders = request.getAllResponseHeaders() // 得到一个字符串 => 解析成对象类型
            const responseHeaders = parseHeaders(request.getAllResponseHeaders())
            const responseData = responseType !== 'text' ? request.response : request.responseText // 得到一个 JSON 字符串 => 转换成对象类型
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }
            resolve(response)
        }

        // 设置 request header
        Object.keys(headers).forEach(name => {
            // data 为 null，配置 Content-Type 是没有意义的
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name]
            } else {
                request.setRequestHeader(name, headers[name])
            }
        })

        request.send(data)
    })
}