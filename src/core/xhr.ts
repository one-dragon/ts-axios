import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import { isFormData } from '../helpers/utils'
import cookie from '../helpers/cookie'

/*
    创建一个 request 实例。
    执行 request.open 方法初始化。
    执行 configureRequest 配置 request 对象。
    执行 addEvents 给 request 添加事件处理函数。
    执行 processHeaders 处理请求 headers。
    执行 processCancel 处理请求取消逻辑。
    执行 request.send 方法发送请求。
*/
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method, // 默认配置中 method: 'get'
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method!.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    // 配置请求时的 响应返回类型、超时时间、携带请求域cookie
    function configureRequest(): void {
      if (responseType) {
        // 设置响应返回类型： "" | "arraybuffer" | "blob" | "document" | "json" | "text"
        request.responseType = responseType
      }

      // 请求默认的超时时间是 0，即永不超时
      if (timeout) {
        request.timeout = timeout
      }

      // 跨域是否携带请求域下的 cookie
      if (withCredentials) {
        request.withCredentials = !!withCredentials
      }
    }

    // 添加回调事件 网络异常事件、超时事件、下载进度事件、上次进度事件
    function addEvents(): void {
      //
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }

        // 网络错误、超时错误 status 为 0
        if (request.status === 0) {
          return
        }

        // const responseHeaders = request.getAllResponseHeaders() // 得到一个字符串 => 解析成对象类型
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText // 得到一个 JSON 字符串 => 转换成对象类型
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

      // 下载进度事件
      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      // 上传进度事件
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    // 处理请求头 使用FormData删除'Content-Type'、判断withCredentials或为同域，设置xsrf相关内容、Authorization、自定义请求头设置
    function processHeaders(): void {
      // 使用 FormData 上传文件的时候，删除自定义的 headers['Content-Type']
      // 浏览器会自动把请求 headers 中的 Content-Type 设置为 multipart/form-data
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      // 如果 config.withCredentials 为 true 或者是同域请求，往请求 headers 添加 xsrf 相关的字段
      // 从 cookie 中读取 xsrf 的 token 值，把它添加到请求 headers 的 xsrf 相关字段中
      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      // auth 是一个对象结构，包含 username 和 password 2 个属性
      // 往 HTTP 的 请求 header 中添加 Authorization 属性，它的值为 Basic 加密串
      // 这里的加密串是 username:password base64 加密后的结果
      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
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
    }

    // 处理取消请求
    function processCancel(): void {
      // 取消请求
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    // 响应数据的成功、错误处理
    function handleResponse(response: AxiosResponse): void {
      // if(response.status >= 200 && response.status < 300) {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        // reject(new Error(`Request failed with status code ${response.status}`))
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
