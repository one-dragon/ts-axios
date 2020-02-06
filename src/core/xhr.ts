
import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { 
            data = null, 
            url, 
            method = 'get', 
            headers, 
            responseType, 
            timeout, 
            cancelToken, 
            withCredentials,
            xsrfCookieName,
            xsrfHeaderName
        } = config

        const request = new XMLHttpRequest()

        if (responseType) { // 设置响应返回类型： "" | "arraybuffer" | "blob" | "document" | "json" | "text"
            request.responseType = responseType
        }

        // 请求默认的超时时间是 0，即永不超时
        if(timeout) {
            request.timeout = timeout
        }

        // 跨域是否携带请求域下的 cookie
        if(withCredentials) {
            request.withCredentials = !!withCredentials
        }

        request.open(method.toUpperCase(), url!, true)

        request.onreadystatechange = function handleLoad() {
            if(request.readyState !== 4) {
                return
            }

            // 网络错误、超时错误 status 为 0
            if(request.status === 0) {
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
            // resolve(response)
            handleResponse(response)
        }

        // 当网络出现异常（比如不通）的时候发送请求会触发 XMLHttpRequest 对象实例的 error 事件
        request.onerror = function handleError(e) {
            // ProgressEvent
            // reject(new Error('Network Error'))
            reject(createError('Network Error', config, null, request)) // 获取不到 response
        }

        // 超时
        request.ontimeout = function handleTimeout() {
            // reject(new Error(`Timeout of ${timeout} ms exceeded`))
            // ECONNABORTED: 网络请求术语，代表网络被终止
            reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request)) // 获取不到 response
        }

        // 如果 config.withCredentials 为 true 或者是同域请求，往请求 headers 添加 xsrf 相关的字段
        // 从 cookie 中读取 xsrf 的 token 值，把它添加到请求 headers 的 xsrf 相关字段中
        if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName ) {
            const xsrfValue = cookie.read(xsrfCookieName)
            if (xsrfValue && xsrfHeaderName) {
                headers[xsrfHeaderName] = xsrfValue
            }
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

        // 取消请求
        if(cancelToken) {
            cancelToken.promise.then(reason => {
                request.abort()
                reject(reason)
            })
        }

        request.send(data)
        
        // 响应数据的成功、错误处理
        function handleResponse(response: AxiosResponse): void {
            if(response.status >= 200 && response.status < 300) {
                resolve(response)
            }else {
                // reject(new Error(`Request failed with status code ${response.status}`))
                reject(createError(`Request failed with status code ${response.status}`, config, null, request, response))
            }
        }
    })
}