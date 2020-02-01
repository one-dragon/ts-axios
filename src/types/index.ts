
export type Method =
    | 'get'
    | 'GET'
    | 'delete'
    | 'DELETE'
    | 'head'
    | 'HEAD'
    | 'options'
    | 'OPTIONS'
    | 'post'
    | 'POST'
    | 'put'
    | 'PUT'
    | 'patch'
    | 'PATCH'

// 配置 config 接口定义
export interface AxiosRequestConfig {
    url: string
    method?: Method
    data?: any
    params?: any
    headers?: any
    // 指定响应的数据类型
    // type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";
    responseType?: XMLHttpRequestResponseType
    timeout?: number
}

// 响应数据 res 接口定义
export interface AxiosResponse {
    data: any
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any // XMLHttpRequest
}

// axios 函数返回的是一个 Promise 对象
// 那么 resolve 函数中的参数就是一个 AxiosResponse 类型
export interface AxiosPromise extends Promise<AxiosResponse> {

}

// 错误信息 error 接口定义
export interface AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any // XMLHttpRequest
    response?: AxiosResponse
}