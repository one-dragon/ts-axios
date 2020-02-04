
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
    url?: string // axios.get(url, config?) 中 url 必传，所以 config.url 可以选传
    method?: Method
    data?: any
    params?: any
    headers?: any
    // 指定响应的数据类型
    // type XMLHttpRequestResponseType = "" | "arraybuffer" | "blob" | "document" | "json" | "text";
    responseType?: XMLHttpRequestResponseType
    timeout?: number

    [propName: string]: any
}

// 响应数据 res 接口定义
// 响应数据支持泛型
export interface AxiosResponse<T = any> {
    data: T
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any // XMLHttpRequest
}

// axios 函数返回的是一个 Promise 对象
// 那么 resolve 函数中的参数就是一个 AxiosResponse 类型
export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}

// 错误信息 error 接口定义
export interface AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    request?: any // XMLHttpRequest
    response?: AxiosResponse
}

// 类 Axios 接口定义
export interface Axios {
    defaults: AxiosRequestConfig

    interceptors: {
        request: AxiosInterceptorManager<AxiosRequestConfig>
        response: AxiosInterceptorManager<AxiosResponse>
    }

    request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>

    get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 继承 Axios 的 AxiosInstance 混合接口定义
export interface AxiosInstance extends Axios {
    <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

    // 支持传入 url和config
    <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 拦截器管理 接口定义
// 给外部使用
export interface AxiosInterceptorManager<T> {
    // 返回一个 id 用于删除，给 eject 使用
    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number

    eject(id: number): void
}
// 请求拦截器是 AxiosRequestConfig 类型的，而响应拦截器是 AxiosResponse 类型的
export interface ResolvedFn<T> {
    (val: T): T | Promise<T>
}
// 请求拦截器、响应拦截器的参数类型是 any 类型的
export interface RejectedFn {
    (error: any): any
}