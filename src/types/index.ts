
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
}

// 数据 res 接口定义
export interface AxiosResponse {
    data: any
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any // XMLHttpRequest类型
}

// axios 函数返回的是一个 Promise 对象
// 那么 resolve 函数中的参数就是一个 AxiosResponse 类型
export interface AxiosPromise extends Promise<AxiosResponse> {

}